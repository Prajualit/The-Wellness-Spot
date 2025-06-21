import Image from "next/image";
import families1 from "@/app/assets/families/families1.jpg";
import families2 from "@/app/assets/families/families2.jpg";

export default function Product() {
  return (
    <div>
      <section
        id="products"
        className="w-full pb-32 px-8 bg-gradient-to-tr from-[#e3fcec] via-white to-[#e8f0fe] relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-slide-up mb-4">
              Happy Families
            </h2>
            <div className="flex items-center justify-center mb-3">
              <div className="h-0.5 w-16 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"></div>
              <div className="mx-3 text-2xl">✨</div>
              <div className="h-0.5 w-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
            </div>
            <p className="text-gray-600 text-lg font-light max-w-md mx-auto">
              Capturing precious moments and creating memories that last a
              lifetime
            </p>
          </div>

          {/* Photo Frame Wall */}
          <div className="relative min-h-[500px] flex items-center justify-center">
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 text-yellow-400 text-2xl animate-pulse">
              ⭐
            </div>
            <div className="absolute top-20 right-16 text-pink-400 text-xl animate-bounce">
              💝
            </div>
            <div className="absolute bottom-16 left-20 text-blue-400 text-lg animate-pulse">
              🎈
            </div>
            <div className="absolute bottom-10 right-12 text-green-400 text-xl animate-bounce">
              🌟
            </div>

            {/* Photo Frame 1 - Tilted left and positioned left */}
            <div className="absolute transform -rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-110 hover:z-10 -translate-x-40 -translate-y-8 hover:shadow-3xl">
              <div className="bg-white p-5 shadow-2xl shadow-gray-400/50 rounded-sm hover:shadow-emerald-200/30 transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={families1}
                    alt="Happy Family 1"
                    width={320}
                    height={420}
                    className="object-cover rounded-sm filter hover:brightness-110 transition-all duration-300"
                  />
                  {/* Enhanced tape effect on corners */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 opacity-90 transform rotate-45 shadow-md border border-yellow-300/20"></div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 opacity-90 transform rotate-45 shadow-md border border-yellow-300/20"></div>
                  <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 opacity-90 transform rotate-45 shadow-md border border-yellow-300/20"></div>
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 opacity-90 transform rotate-45 shadow-md border border-yellow-300/20"></div>
                </div>
                {/* Photo caption */}
                <div className="mt-4 text-center">
                  <p className="text-gray-700 text-base font-medium tracking-wide">
                    Beautiful Moments
                  </p>
                </div>
              </div>
            </div>

            {/* Photo Frame 2 - Tilted right and positioned right */}
            <div className="absolute transform rotate-4 hover:rotate-0 transition-all duration-500 hover:scale-110 hover:z-10 translate-x-40 translate-y-8 hover:shadow-3xl">
              <div className="bg-white p-5 shadow-2xl shadow-gray-400/50 rounded-sm hover:shadow-blue-200/30 transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={families2}
                    alt="Happy Family 2"
                    width={320}
                    height={420}
                    className="object-cover rounded-sm filter hover:brightness-110 transition-all duration-300"
                  />
                  {/* Enhanced tape effect on corners */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 opacity-90 transform rotate-45 shadow-md border border-yellow-300/20"></div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 opacity-90 transform rotate-45 shadow-md border border-yellow-300/20"></div>
                  <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 opacity-90 transform rotate-45 shadow-md border border-yellow-300/20"></div>
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 opacity-90 transform rotate-45 shadow-md border border-yellow-300/20"></div>
                </div>
                {/* Photo caption */}
                <div className="mt-4 text-center">
                  <p className="text-gray-700 text-base font-medium tracking-wide">
                    Forever Together
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
