import Image from "next/image";
import product from '../app/assets/product.png';
import product2 from '../app/assets/product2.png';
import product3 from '../app/assets/product3.png';


export default function Product(){
    
    return(
        <div>
            <section id="products-section" className="w-full py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-black mb-12">Mass Gain &amp; Weight Loss Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" id="products-card-block">
                <div id="product-card-1" className="bg-gradient-to-tr from-[#ffe7b2] to-[#ffe0e9] p-7 rounded-2xl shadow-md flex flex-col items-center gap-5">
                    <Image className="w-32 h-32 rounded-xl shadow-lg object-cover mb-2" src={product} alt="mass gainer supplement packaging, fitness, bright, clean, dribbble style"></Image>
                    <div className="font-bold text-lg text-gray-800 mb-1">Pro Mass Gainer</div>
                    <p className="text-gray-700 text-center mb-2">High-calorie protein blend for muscle growth. Ideal for hard-gainers and those looking to bulk up efficiently.</p>
                    <button className="px-5 py-2 bg-black text-white rounded-lg font-semibold text-base hover:bg-black-dark transition">Learn More</button>
                </div>
                <div id="product-card-2" className="bg-gradient-to-tr from-[#c1f8cf] to-[#c8e7fa] p-7 rounded-2xl shadow-md flex flex-col items-center gap-5">
                    <Image className="w-32 h-32 rounded-xl shadow-lg object-cover mb-2" src={product2} alt="whey protein supplement packaging, fitness, bright, clean, dribbble style"></Image>
                    <div className="font-bold text-lg text-gray-800 mb-1">Whey Protein Isolate</div>
                    <p className="text-gray-700 text-center mb-2">Pure protein for lean muscle gain and recovery. Supports muscle repair post-workout.</p>
                    <button className="px-5 py-2 bg-black text-white rounded-lg font-semibold text-base hover:bg-black-dark transition">Learn More</button>
                </div>
                <div id="product-card-3" className="bg-gradient-to-tr from-[#fceabb] to-[#f8b500] p-7 rounded-2xl shadow-md flex flex-col items-center gap-5">
                    <Image className="w-32 h-32 rounded-xl shadow-lg object-cover mb-2" src={product3} alt="fat burner supplement packaging, fitness, bright, clean, dribbble style"></Image>
                    <div className="font-bold text-lg text-gray-800 mb-1">Thermo Burn Fat Cutter</div>
                    <p className="text-gray-700 text-center mb-2">Natural fat burner for accelerated weight loss. Boosts metabolism and energy.</p>
                    <button className="px-5 py-2 bg-black text-white rounded-lg font-semibold text-base hover:bg-black-dark transition">Learn More</button>
                </div>
            </div>
        </div>
    </section>
        </div>
    );
}