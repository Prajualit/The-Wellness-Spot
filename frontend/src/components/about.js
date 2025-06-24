import Image from "next/image";
import owner1 from "../app/assets/owner1.png";
import owner2 from "../app/assets/owner2.png";
import Link from "next/link";

const aboutList = [
  {
    description:
      "Hi, I’m Jyoti Prakash, a Senior Wellness Coach passionate about helping people achieve holistic health. With years of experience, I guide individuals toward balanced, mindful living.",
    points: [
      "Sr. Wellness Coach",
      "Nutrition and Workout Expert",
      "Strength & Conditioning Coach",
    ],
    socials: [
      { label: "Instagram", href: "" },
      { label: "Facebook", href: "" },
    ],
    image: owner1,
  },
  {
    description:
      "Hi, I’m Poonam, a Senior Wellness Coach passionate about helping people achieve holistic health. With years of experience, I guide individuals toward balanced, mindful living.",
    points: [
      "Sr. Wellness Coach",
      "Nutrition and Workout Expert",
      "Strength & Conditioning Coach",
    ],
    socials: [
      { label: "Instagram", href: "" },
      { label: "Facebook", href: "" },
    ],
    image: owner2,
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
        {aboutList.map((about, idx) => (
          <div
            key={idx}
            className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12"
          >
            <div
              className="flex-1 flex items-center justify-center"
              id="about-avatar-block"
            >
              <Image
                src={about.image}
                alt="Owner"
                className="rounded-2xl shadow-lg w-56 h-64 object-cover border-4 border-black"
              />
            </div>
            <div className="flex-1" id="about-owner-content-block">
              <p className="text-lg text-gray-700 mb-4">{about.description}</p>
              <ul className="space-y-2 mb-6">
                {about.points.map((point, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-800">
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
      </section>
    </div>
  );
}
