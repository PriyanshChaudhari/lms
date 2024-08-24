import { db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";

export async function createUserWithPRN(userId: string, password: string, email?: string) {
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // // Store user details in Firestore
    // await db.collection("users").doc(prn).set({
    //   prn: prn,
    //   email: email || `${prn}@example.com`, // Use a dummy email if not provided
    //   passwordHash: passwordHash,
    //   // Add any other custom fields here
    // });

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
