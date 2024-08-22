import { db } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import bcrypt from "bcrypt";

export async function createUserWithPRN(prn: string, password: string, email?: string) {
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

    await setDoc(doc(db, "users", prn), {
      prn: prn,
      email: email || `${prn}@example.com`, // Use a dummy email if not provided
      passwordHash: passwordHash,
      // Add any other custom fields here
    });


    console.log("User created with PRN:", prn);
    return { prn, email: email || `${prn}@example.com` };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user');
  }
}
