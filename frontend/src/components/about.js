import Image from 'next/image';
import owner from '../app/assets/owner.jpg'; 


export default function About() {

return(
    <div>
        <section id="about" className="w-full py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto flex  flex-col md:flex-row items-center gap-12">
            <div className="flex-1 flex items-center justify-center" id="about-avatar-block">
                <Image src={owner} alt="Owner" className="rounded-2xl shadow-lg w-56 h-56 object-cover border-4 border-primary"></Image>
            </div>
            <div className="flex-1" id="about-owner-content-block">
                <h2 className="text-3xl font-bold text-black mb-5">Meet Your Trainer</h2>
                <p className="text-lg text-gray-700 mb-4">
                    Hi, I am Alex Carter—over 10 years transforming lives as a certified fitness coach and nutrition specialist. My passion is empowering people to become healthier, stronger, and happier versions of themselves.
                </p>
                <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-gray-800">
                        <i className="text-primary" data-fa-i2svg="">
                            <svg className="svg-inline--fa text-black fa-check" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                <path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path>
                            </svg>
                        </i> ISSA Certified Personal Trainer
                    </li>
                    <li className="flex items-center gap-2 text-gray-800">
                        <i className="text-primary" data-fa-i2svg="">
                            <svg className="svg-inline--fa fa-check" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                <path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path>
                            </svg>
                        </i> National Nutrition Expert
                    </li>
                    <li className="flex items-center gap-2 text-gray-800">
                        <i className="text-primary" data-fa-i2svg="">
                            <svg className="svg-inline--fa fa-check" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                <path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path>
                            </svg>
                        </i> Strength &amp; Conditioning Coach
                    </li>
                </ul>
                <div className="flex gap-4 text-black mt-2">
                    <span className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer">
                        <i data-fa-i2svg="">
                            <svg className="svg-inline--fa fa-instagram" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="instagram" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                            </svg>
                        </i> Instagram
                    </span>
                    <span className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer">
                        <i data-fa-i2svg="">
                            <svg className="svg-inline--fa fa-facebook" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                                <path fill="currentColor" d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>
                            </svg>
                        </i> Facebook
                    </span>
                </div>
            </div>
        </div>
    </section>
    </div>
);

}