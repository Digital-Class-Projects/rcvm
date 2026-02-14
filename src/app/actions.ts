"use server";

import * as z from "zod";
import { initializeFirebase } from "@/firebase";
import { get, ref, set } from "firebase/database";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  bookingDate: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function submitContactForm(values: z.infer<typeof contactSchema>) {
  try {
    const validatedData = contactSchema.parse(values);
    
    const { database } = initializeFirebase();
    if (!database) {
      throw new Error("Firebase Realtime Database is not initialized.");
    }
    
    const submissionsRef = ref(database, 'contacts');
    const newSubmissionRef = ref(database, `contacts/${Date.now()}`);
    
    await set(newSubmissionRef, {
      ...validatedData,
      submittedAt: new Date().toISOString(),
    });

    return { success: true, message: "Thank you! Your message has been sent." };

  } catch (error) {
    console.error("Contact form submission error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, message: "Please check your form for errors.", errors: error.flatten().fieldErrors };
    }
    return { success: false, message: "There was an error sending your message. Please try again later." };
  }
}
