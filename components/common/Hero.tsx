import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export function Hero({ title, subtitle, backgroundImage }: HeroProps) {
  return (
    <section className="relative min-h-[500px] h-[90vh]  flex flex-col lg:flex-row">
      {/* Left side: Background image */}
      <div
        className="md:flex-[0_0_65%] h-[75vh] lg:h-auto bg-cover bg-center"
        style={{
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      />

      {/* Right side: content box */}
      <div
        className="
        md:flex-[0_0_35%]
        flex flex-col justify-center p-8 
        bg-[#F5F1EC]
        text-black
        text-center lg:text-left
      "
      >
        <h1 className="text-4xl  font-light mb-4">{title}</h1>
        {subtitle && <p className="text-lg  mb-8 opacity-90">{subtitle}</p>}
        <Link href="/properties" passHref>
          <Button
            variant="outline"
            size="md"
            className="w-48 mx-auto md:mx-0 text-xs tracking-wider"
          >
            BROWSE PROPERTIES
          </Button>
        </Link>
      </div>
    </section>
  );
}
