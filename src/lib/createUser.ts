import { db } from "@/lib/firebaseConfig";
import { doc, setDoc, writeBatch } from "firebase/firestore";
import bcrypt from "bcryptjs";

export async function createUserWithPRN(userId: string, password: string, email?: string) {
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    await setDoc(doc(db, "users", userId), {
      email: email || `${userId}@example.com`, // Use a dummy email if not provided
      passwordHash: passwordHash,
      // Add any other custom fields here
    });

    console.log("User created with PRN:", userId);
    return { userId, email: email || `${userId}@example.com` };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user');
  }
}

export async function createUsersWithPRNBatch(jsonData: { userId: string, password: string, email?: string }[]) {
  const batch = writeBatch(db);

  try {
    for (const user of jsonData) {
      const { userId, password, email } = user;

      // Validate inputs
      if (!userId || !password) {
        throw new Error('PRN and password are required');
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const userRef = doc(db, String(process.env.USERS_DB), String(userId));
      batch.set(userRef, {
        email: email || `${userId}@example.com`, // Use a dummy email if not provided
        passwordHash: passwordHash,
        // Add any other custom fields here
      });
    }

    await batch.commit();
    console.log("Batch user creation successful");
    return jsonData.map(user => ({ userId: user.userId, email: user.email || `${user.userId}@example.com` }));
  } catch (error) {
    console.error('Error creating users in batch:', error);
    throw new Error('Error creating users in batch');
  }
}