import { TransitionLink } from "@/components/TransitionLink";

export default function NotFound() {
  return <div className="ph min-h-screen"><h1 className="d">File <span>Not Found</span></h1><p className="my-8">This archive file does not exist.</p><TransitionLink href="/" className="btn">BACK TO HOME</TransitionLink></div>;
}
