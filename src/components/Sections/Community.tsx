// src/components/Sections/Community.tsx
import { Users} from 'lucide-react'

export default function Community() {
  return (
    <section className="py-24" id="community">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 sm:p-12 text-center">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#f53513ff]/20 via-transparent to-transparent" />
          
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Icon */}
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700">
              <Users className="w-8 h-8 text-[#f53513ff]" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white pixel-font mb-6 tracking-tight">
              JOIN THE TrevArts
            </h2>

            {/* Description */}
            <p className="text-lg sm:text-xl text-zinc-400 mb-8 max-w-xl">
              Be part of the most innovative NFT community. Connect with holders, get exclusive updates, and shape the future.
            </p>

            {/* Social Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#f53513ff] to-transparent" />

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}