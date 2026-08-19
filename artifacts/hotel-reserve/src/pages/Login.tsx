import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { getErrorMessage } from '@/lib/api';

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      setLocation('/rezervasyonlarim');
    } catch (err) {
      setError(getErrorMessage(err, 'Giriş başarısız. Kullanıcı adı veya şifre hatalı.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="bg-card border border-border p-8 md:p-12 max-w-md w-full">
        <h1 className="text-3xl font-serif text-primary mb-2 text-center">Giriş Yap</h1>
        <p className="text-muted-foreground text-sm text-center mb-10">
          Rezervasyonlarınızı görüntülemek için giriş yapın.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-widest text-muted-foreground">Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-primary transition-colors text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm uppercase tracking-widest text-muted-foreground">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-primary transition-colors text-foreground"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Hesabınız yok mu?{' '}
          <Link href="/kayit" className="text-primary underline">
            Kayıt Olun
          </Link>
        </p>
      </div>
    </div>
  );
}
