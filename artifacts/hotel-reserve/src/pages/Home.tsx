import { Link } from 'wouter';
import { ROOMS } from '@/data/mock';
import hotelLobbyImg from '@assets/generated_images/hotel-lobby.jpg';
import room2Img from '@assets/generated_images/room-2.jpg';

export default function Home() {
  const featuredRooms = ROOMS.slice(0, 3);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={hotelLobbyImg} 
            alt="Velaris House Lobby" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h2 className="text-secondary/80 text-sm tracking-[0.4em] uppercase mb-6">İstanbul'un Kalbinde</h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-tight">
            Zamanın Yavaşladığı Yer
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            İncelikle restore edilmiş tarihi bir konak. Detayların önemsendiği, sessizliğin lükse dönüştüğü unutulmaz bir konaklama deneyimi.
          </p>
          <Link 
            href="/rezervasyon" 
            className="inline-flex bg-white text-primary px-8 py-4 text-sm uppercase tracking-widest hover:bg-white/90 transition-colors"
          >
            Yer Ayırtın
          </Link>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 md:py-32 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl md:text-4xl font-serif text-primary mb-8 leading-snug">
            Her misafirimiz için özel olarak hazırlanmış, karakteri olan odalar.
          </h3>
          <p className="text-muted-foreground text-lg leading-relaxed mb-12">
            Velaris House'ta hiçbir oda birbirinin aynısı değildir. Keten dokular, ahşabın sıcaklığı ve özenle seçilmiş aydınlatmalarla, sadece konaklamanız için değil, dinlenmeniz ve yenilenmeniz için tasarlandılar.
          </p>
          <Link href="/odalar" className="text-primary uppercase tracking-widest text-sm font-medium border-b border-primary pb-1 hover:text-primary/70 transition-colors">
            Tüm Odaları Keşfedin
          </Link>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {featuredRooms.map((room) => (
              <div key={room.id} className="group cursor-pointer">
                <Link href={`/odalar/${room.slug}`}>
                  <div className="relative aspect-[4/5] overflow-hidden mb-6">
                    <img 
                      src={room.imageUrl} 
                      alt={room.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="text-2xl font-serif text-primary mb-2">{room.name}</h4>
                  <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{room.shortDescription}</p>
                  <div className="text-sm font-medium text-primary">
                    {room.pricePerNight.toLocaleString('tr-TR')} ₺ <span className="text-muted-foreground font-normal">/ gece</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm tracking-[0.3em] uppercase text-secondary mb-6">Felsefemiz</h2>
              <h3 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">Sakinliğin İçindeki Şıklık</h3>
              <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
                Lüksün gürültülü değil, sessiz ve hissedilebilir olması gerektiğine inanıyoruz. Size ayrılan her alan, günün yorgunluğunu arkanızda bırakmanız için tasarlandı.
              </p>
              <ul className="space-y-4 mb-12 text-primary-foreground/90">
                <li className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                  Kişiselleştirilmiş hizmet
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                  Özel tasarım mobilyalar
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                  Organik keten tekstiller
                </li>
              </ul>
              <Link 
                href="/iletisim" 
                className="inline-block border border-secondary text-secondary px-8 py-3 text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-colors"
              >
                Bizimle İletişime Geçin
              </Link>
            </div>
            <div className="relative aspect-square">
              <img 
                src={room2Img} 
                alt="Velaris House Detail" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
