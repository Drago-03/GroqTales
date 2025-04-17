"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Github, 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin,
  Twitter,
  Linkedin,
  Send
} from "lucide-react";

// Floating GitHub button component
const FloatingGithub = () => (
  <Link 
    href="https://github.com/Drago-03/GroqTales.git"
    target="_blank"
    className="fixed bottom-24 right-6 p-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
  >
    <Github className="w-6 h-6 text-white" />
  </Link>
);

// Floating doodle elements
const FloatingDoodles = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full blur-3xl opacity-20 animate-float"></div>
    <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-violet-200 to-purple-200 rounded-full blur-3xl opacity-20 animate-float-delayed"></div>
    <div className="absolute top-1/3 right-1/3 w-36 h-36 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-20 animate-float-slow"></div>
  </div>
);

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const ContactInfo = ({ icon: Icon, title, content, link }: any) => (
  <div className="flex items-start space-x-4">
    <div className="p-2 bg-primary/10 rounded-full">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <h3 className="font-medium">{title}</h3>
      {link ? (
        <Link href={link} className="text-sm text-muted-foreground hover:text-primary">
          {content}
        </Link>
      ) : (
        <p className="text-sm text-muted-foreground">{content}</p>
      )}
    </div>
  </div>
);

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    form.reset();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <FloatingDoodles />
      <FloatingGithub />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent mb-4">
              Get in Touch
            </h1>
            <p className="text-muted-foreground text-lg">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                      <Send className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-4">
                      Thank you for reaching out. We'll respond to your message soon.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="What's this about?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Your message..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Reach out to us through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ContactInfo
                    icon={Mail}
                    title="Email"
                    content="support@groqtales.com"
                    link="mailto:support@groqtales.com"
                  />
                  <ContactInfo
                    icon={MessageSquare}
                    title="Live Chat"
                    content="Available 24/7 for premium users"
                  />
                  <ContactInfo
                    icon={Phone}
                    title="Phone"
                    content="+1 (555) 123-4567"
                    link="tel:+15551234567"
                  />
                  <ContactInfo
                    icon={MapPin}
                    title="Office"
                    content="123 Innovation Drive, Tech Valley, CA 94043"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connect With Us</CardTitle>
                  <CardDescription>
                    Follow us on social media for updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="https://twitter.com/groqtales" target="_blank">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="https://linkedin.com/company/groqtales" target="_blank">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 