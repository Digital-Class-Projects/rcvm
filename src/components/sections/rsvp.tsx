"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { submitContactForm } from "@/app/actions";
import { Heart } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  bookingDate: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Rsvp() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bookingDate: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await submitContactForm(values);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: result.message,
      });
    }
  }

  return (
    <section id="rsvp" className="py-24 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://ik.imagekit.io/rgazxzsxr/contact-bg.jpg?updatedAt=1762499298455')"}}>
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto shadow-2xl bg-white/90 backdrop-blur-sm border-0">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="thank-you"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                  className="text-center h-[470px] flex flex-col items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <Heart className="w-24 h-24 text-primary" fill="currentColor" />
                  </motion.div>
                  <h2 className="font-serif text-5xl text-foreground mt-6">Thank You!</h2>
                  <p className="text-muted-foreground mt-2">Your message has been sent successfully. We will be in touch soon.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                >
                  <div className="text-center mb-8">
                    <motion.div variants={formVariants} className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold mb-4">
                        Contact us if any query
                    </motion.div>
                      <motion.h2 variants={formVariants} className="font-serif text-5xl text-foreground">
                        Contact Us
                      </motion.h2>
                      <motion.p variants={formVariants} className="text-muted-foreground mt-2 max-w-md mx-auto">Please fill out the form and we will get back to you shortly.</motion.p>
                  </div>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <motion.div variants={formVariants} className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Name" {...field} className="bg-white/80 border-gray-300"/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Email" {...field} className="bg-white/80 border-gray-300"/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      <motion.div variants={formVariants} className="grid md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Phone" {...field} className="bg-white/80 border-gray-300"/>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           <FormField
                            control={form.control}
                            name="bookingDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Booking For" type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} {...field} className="bg-white/80 border-gray-300"/>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                      </motion.div>
                      <motion.div variants={formVariants}>
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Message"
                                  className="resize-none bg-white/80 border-gray-300"
                                  rows={5}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div variants={formVariants}>
                        <Button type="submit" size="lg" className="w-full bg-primary hover:bg-accent text-primary-foreground rounded-full" disabled={form.formState.isSubmitting}>
                          {form.formState.isSubmitting ? "Sending..." : "Send"}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
