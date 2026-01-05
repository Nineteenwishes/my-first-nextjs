import Image from "next/image";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-black font-sans dark:bg-zinc-950 dark:text-white">
            {/* Navbar/Header Area */}
            <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12 sm:pb-24">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-end gap-4 sm:gap-6">
                            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none">
                                Akbar <span className="text-gray-400 font-black">Maulana</span>
                            </h1>
                            <span className="text-sm sm:text-xl md:text-2xl text-gray-500 dark:text-gray-300 font-light mb-1 sm:mb-2">Web Developer</span>
                        </div>
                        <div className="h-1.5 w-20 sm:w-32 bg-gray-800 dark:bg-gray-200 mt-3"></div>
                    </div>
                    {/* Toggle tema */}
                    <ThemeToggle />
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8 sm:gap-12 md:gap-16 items-start">

                    {/* Left Column: Image */}
                    <div className="relative w-full md:w-[320px] aspect-[3/4] shrink-0 mx-auto md:mx-0">
                        <Image
                            src="/images/profile-dark.JPG"
                            alt="Akbar Maulana Profile"
                            fill
                            className="object-cover rounded-2xl shadow-xl"
                            priority
                        />
                    </div>

                    {/* Right Column: Bio Content */}
                    <div className="flex-1 space-y-6 sm:space-y-8 pt-2 sm:pt-4">
                        {/* Section: Tentang Saya */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Tentang Saya</h2>
                            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-800 dark:text-white leading-relaxed font-normal">
                                <p>
                                    Saya adalah <strong className="font-bold">web developer</strong> yang fokus membangun produk
                                    digital yang cepat, bersih, dan memberikan pengalaman
                                    pengguna terbaik.
                                </p>
                                <p>
                                    Saat ini saya sedang prakerin di <strong className="font-bold">Ashari Tech</strong> dan sedang
                                    belajar instalasi Next.js
                                </p>
                                <p>
                                    Saya senang mengerjakan proyek dari awal hingga selesai,
                                    mulai dari perancangan antarmuka hingga implementasi
                                    fungsionalitas kompleks di sisi klien dan server.
                                </p>
                            </div>
                        </div>

                        {/* Divider - garis pemisah */}
                        <div className="h-px w-full bg-gray-300 my-6 sm:my-8"></div>

                        {/* Section: Keahlian Utama */}
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Keahlian Utama</h3>
                            <div className="flex flex-wrap gap-2.5 sm:gap-3">
                                {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'UI Design', 'Frontend Development'].map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 sm:px-4 py-2 bg-gray-100 rounded-full text-xs sm:text-sm font-medium text-gray-800 border border-gray-300"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}