import { Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-white py-4">
      <div className="container mx-auto grid grid-cols-3 items-center text-center">
        <div className="text-left">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} MoodTunes. All rights reserved.
          </p>
        </div>

        <div>
          <p className="text-sm">Made using Kiro</p>
        </div>

        <div className="flex justify-end space-x-4">
          <a
            href="https://github.com/zeropse"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/zeropse/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
