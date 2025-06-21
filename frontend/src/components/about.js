import Image from "next/image";
import owner from "../app/assets/owner.jpg";
import Link from "next/link";

export default function About() {
  return (
    <div>
      <section
        id="about"
        className="w-full py-32 px-8 bg-gradient-to-tr from-[#e3fcec] via-white to-[#e8f0fe] relative overflow-hiddene"
      >
        <div className="max-w-6xl mx-auto flex  flex-col md:flex-row items-center gap-12">
          <div
            className="flex-1 flex items-center justify-center"
            id="about-avatar-block"
          >
            <Image
              src={owner}
              alt="Owner"
              className="rounded-2xl shadow-lg w-56 h-56 object-cover border-4 border-primary"
            ></Image>
          </div>
          <div className="flex-1" id="about-owner-content-block">
            <h2 className="text-3xl font-bold text-black mb-5">
              Meet Your Trainer
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Hi, I’m Jyoti Prakash, a Senior Wellness Coach passionate about
              helping people achieve holistic health. With years of experience,
              I guide individuals toward balanced, mindful living.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-gray-800">
                <i className="text-primary" data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa text-black fa-check"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="check"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                    ></path>
                  </svg>
                </i>{" "}
                Sr. Wellness Coach
              </li>
              <li className="flex items-center gap-2 text-gray-800">
                <i className="text-primary" data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-check"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="check"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                    ></path>
                  </svg>
                </i>{" "}
                Nutrition and Workout Expert
              </li>
              <li className="flex items-center gap-2 text-gray-800">
                <i className="text-primary" data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-check"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="check"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                    ></path>
                  </svg>
                </i>{" "}
                Strength &amp; Conditioning Coach
              </li>
            </ul>
            <div className="flex gap-4 text-black mt-2">
              <Link href="">
                <span className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer">
                  Instagram
                </span>
              </Link>
              <Link href="">
                <span className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer">
                  Facebook
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
