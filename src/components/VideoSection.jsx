"use client";

const videos = [
  {
    id: 1,
    title: "SPORTS BRAS",
    subtitle: "NIKE SKIMS",
    videoUrl:
      "https://skims.imgix.net/videos/c/o/v/e3f5015232904c5296620036ae2b78ef.mp4?fm=mp4&video-bitrate=3M&video-thumbnail=auto",
  },
  {
    id: 2,
    title: "TOPS",
    subtitle: "NIKE SKIMS",
    videoUrl:
      "https://skims.imgix.net/videos/c/o/v/d521b6c3e9564b8e80101df77ab18950.mp4?fm=mp4&video-bitrate=3M&video-thumbnail=auto",
  },
  {
    id: 3,
    title: "LEGGINGS",
    subtitle: "NIKE SKIMS",
    videoUrl:
      "https://skims.imgix.net/videos/c/o/v/29d03ecc6d7f41f29f850190229253ff.mp4?fm=mp4&video-bitrate=3M&video-thumbnail=auto",
  },
  {
    id: 4,
    title: "ACCESSORIES",
    subtitle: "NIKE SKIMS",
    videoUrl:
      "https://skims.imgix.net/videos/c/o/v/5ed3c5c36f0446b89583d30c81093ae4.mp4?fm=mp4&video-bitrate=3M&video-thumbnail=auto",
  },
];

function VideoCard({ video }) {
  return (
    <div className="group block cursor-pointer">
      <div className="relative aspect-[0.8] w-full bg-gray-100 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={video.videoUrl}
          loop
          muted
          playsInline
          autoPlay
        />
      </div>
      <h3 className="mt-4 text-sm font-extrabold uppercase tracking-wide text-[#2d2a26] pl-2 group-hover:underline underline-offset-4 decoration-1">
        {video.title}
      </h3>
    </div>
  );
}

export default function VideoSection() {
  return (
    <section className="w-full bg-white pt-12 pb-0 overflow-hidden">
      <div className="w-full">
        {/* Video Grid - Matched to TrendingCategories */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}
