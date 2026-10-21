import { useLocation } from 'react-router-dom';
import { useSettings } from '../../store';

export function AuroraBackground() {
  const location = useLocation();
  const theme = useSettings((s) => s.theme);
  const effects = useSettings((s) => s.effects);

  // In reading mode, if theme is not space (i.e. sepia or ink), suppress aurora
  const reading = location.pathname.startsWith('/read/');
  if (reading && theme !== 'space') return null;
  if (!effects) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-20 overflow-hidden opacity-40 transition-opacity duration-1000"
      aria-hidden="true"
    >
      {/* Aurora glow blobs with subtle organic floating */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full filter blur-[100px] opacity-25 animate-aurora-blob-1"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-[40%] -right-[15%] w-[55vw] h-[55vw] rounded-full filter blur-[120px] opacity-20 animate-aurora-blob-2"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(52, 211, 153, 0.1) 50%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[50vw] rounded-full filter blur-[130px] opacity-20 animate-aurora-blob-3"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.1) 50%, transparent 70%)',
        }}
      />
    </div>
  );
}
