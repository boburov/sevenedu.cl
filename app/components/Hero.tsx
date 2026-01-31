import { Rocket, BookOpen } from "lucide-react";
import heroimg from "@/app/images/heroimg.png";

const Hero = () => {
  return (
    <section className="relative w-full py-24 overflow-hidden max-md:hidden bg-gradient-to-br from-primary-soft via-background to-background">
      {/* Purple gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none z-0" />

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 items-center">
        {/* LEFT TEXT SECTION */}
        <div className="flex flex-col justify-center gap-6 animate-fadeIn">
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            Xush kelibsiz, SEVEN EDU platformaga!
          </h1>

          <p className="text-lg lg:text-xl text-text-secondary leading-relaxed max-w-xl">
            O'zbekistondagi eng yaxshi onlayn ta'lim platformasi. <br />
            Sifatli, qulay va zamonaviy bilim bizda. <br />
            O'rganing. Rivojlaning. Yutuqqa yeting!
          </p>

          <div>
            <button className="mt-4 px-6 py-3 bg-primary hover:bg-primary-hover transition-all duration-200 text-primary-foreground text-base rounded-button shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 font-semibold">
              <Rocket className="w-5 h-5" />
              Kurslarni Ko'rish
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="relative animate-fadeInUp delay-150">
          <div className="relative w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-card-hover border border-border">
            <img
              src={heroimg.src}
              alt="SevenEdu platforma rasmi"
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-button shadow-md flex items-center gap-1.5 font-medium">
              <BookOpen className="w-4 h-4" />
              O'rganishni boshlang!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
