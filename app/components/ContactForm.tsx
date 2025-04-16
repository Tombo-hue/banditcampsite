'use client';

import { toast } from "sonner";

export default function ContactForm() {
  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to send message');
        }

        // Clear form
        form.reset();
        toast.success("Message sent successfully!", {
          duration: 5000,
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to send message", {
          duration: 5000,
        });
      }
    }} className="space-y-6 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
            NAME
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue=""
            required
            className="w-full bg-[#111111] border border-blue-500/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
            EMAIL
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue=""
            required
            className="w-full bg-[#111111] border border-blue-500/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
            placeholder="john@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">
          SUBJECT
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          defaultValue=""
          required
          className="w-full bg-[#111111] border border-blue-500/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
          placeholder="What's your inquiry about?"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
          MESSAGE
        </label>
        <textarea
          id="message"
          name="message"
          defaultValue=""
          required
          rows={6}
          className="w-full bg-[#111111] border border-blue-500/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
          placeholder="Tell us about your project..."
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
        >
          SEND MESSAGE
        </button>
      </div>
    </form>
  );
} 