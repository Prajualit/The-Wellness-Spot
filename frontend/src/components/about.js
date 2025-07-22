import Image from "next/image";
import owner1 from "../app/assets/owner1.jpg";
import owner2 from "../app/assets/owner2.png";
import owner3 from "../app/assets/owner3.jpg";
import owner4 from "../app/assets/owner4.jpg";
import owner5 from "../app/assets/owner5.jpg";
import Link from "next/link";

const aboutList = [
  {
    description:
      "Hi, I’m Jyoti Parkash, a Certified Wellness Coach specializing in Nutrigenomics. With 3 years of experience, I have helped over 300 clients achieve their health goals by personalizing nutrition based on their unique genetic makeup.",
    points: [
      "Certified Wellness Coach in Nutrigenomics",
      "3+ years of professional coaching experience",
    ],
    socials: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/jp3793?igsh=MTdkcjlpemlvd25oaw==",
      },
      { label: "Facebook", href: "https://www.facebook.com/share/1GZCZW8pCq/" },
    ],
    image: owner1,
  },
  {
    description:
      "Hi, I’m Poonam, a dedicated Wellness and Lifestyle Coach with 2 years of experience helping individuals achieve healthier, more balanced lives.",
    points: [
      "2 years of experience as a Wellness and Lifestyle Coach",
      "Supportive guidance for nutrition, fitness, and mindset",
    ],
    socials: [
      { label: "Instagram", href: "" },
      { label: "Facebook", href: "" },
    ],
    image: owner2,
  },
  {
    description:
      "Hi, I’m Pamnesh Sharma, an energetic Wellness and Lifestyle Coach with 2 years of experience, specializing in helping busy professionals enhance their performance and prevent burnout.",
    points: [
      "2 years of experience coaching professionals and executives",
      "Expert in stress management and energy optimization techniques",
    ],
    socials: [
      { label: "Instagram", href: "" },
      { label: "Facebook", href: "" },
    ],
    image: owner3,
  },
  {
    description:
      "Hi, I’m Puja, an empathetic and certified Wellness and Lifestyle Coach with 2 years of experience focused on guiding individuals towards inner peace and emotional balance.",
    points: [
      "2 years of experience in holistic and mindful coaching",
      "Specialist in mindfulness practices and stress reduction",
    ],
    socials: [
      { label: "Instagram", href: "" },
      { label: "Facebook", href: "" },
    ],
    image: owner4,
  },
  {
    description:
      "Hi, I’m Karam Chand Verma, a seasoned and certified Wellness and Lifestyle Coach with over 2 years of experience in facilitating profound, long-term health transformations.",
    points: [
      "2 years of experience in transformational health coaching",
      "Expert in advanced nutrition and the science of habit formation",
    ],
    socials: [
      { label: "Instagram", href: "" },
      { label: "Facebook", href: "" },
    ],
    image: owner5,
  },
  // Add more trainers here if needed
];

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-black"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="check"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
  >
    <path
      fill="currentColor"
      d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
    ></path>
  </svg>
);

export default function About() {
  return (
    <div>
      <section
        id="about"
        className="w-full py-32 flex flex-col gap-10 px-8 bg-gradient-to-tr from-[#e3fcec] via-white to-[#e8f0fe] relative overflow-hidden"
      >
        <h2 className="text-4xl font-extrabold text-center text-black mb-12">
          Meet Your Trainers
        </h2>
        <div className="grid  xl:grid-cols-2 space-y-16 ">
          {aboutList.map((about, idx) => (
            <div
              key={idx} 
              className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:space-x-5 space-y-5"
            >
              <div
                className="flex items-center justify-center"
                id="about-avatar-block"
              >
                <div className="w-40 h-52 rounded-2xl shadow-lg border-4 border-black overflow-hidden flex items-center justify-center">
                  <Image
                    src={about.image}
                    alt="Owner"
                    width={160}
                    height={208}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="" id="about-owner-content-block">
                <p className="text-md text-gray-700 mb-4">
                  {about.description}
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  {about.points.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-gray-800"
                    >
                      <CheckIcon /> {point}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-4 text-black mt-2">
                  {about.socials.map((social, i) => (
                    <Link key={i} href={social.href}>
                      <span className="text-black hover:underline font-semibold flex items-center gap-1 cursor-pointer">
                        {social.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
