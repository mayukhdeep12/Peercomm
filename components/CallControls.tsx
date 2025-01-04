import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

interface CallControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

export function CallControls({
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
}: CallControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-4 md:space-x-6">
      <Button
        onClick={onToggleAudio}
        variant={isAudioEnabled ? 'default' : 'secondary'}
        className={`
          relative rounded-full w-14 h-14 md:w-16 md:h-16 p-0 
          transition-all duration-300 transform hover:scale-110
          ${isAudioEnabled 
            ? 'bg-white/15 hover:bg-white/25 border-white/20' 
            : 'bg-red-500/20 hover:bg-red-500/30 border-red-500/30'
          }
          backdrop-blur-xl border shadow-lg
          hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]
          group
        `}
      >
        <div className="relative">
          {isAudioEnabled ? (
            <Mic className="h-6 w-6 md:h-7 md:w-7 text-white transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <MicOff className="h-6 w-6 md:h-7 md:w-7 text-red-500 transition-transform duration-300 group-hover:scale-110" />
          )}
          <div className={`
            absolute -inset-2 rounded-full 
            ${isAudioEnabled ? 'bg-white/5' : 'bg-red-500/5'} 
            animate-ping
          `} />
        </div>
      </Button>

      <Button
        onClick={onEndCall}
        variant="destructive"
        className="
          relative rounded-full w-16 h-16 md:w-20 md:h-20 p-0 
          bg-gradient-to-r from-red-500 to-red-600
          hover:from-red-600 hover:to-red-700
          shadow-lg hover:shadow-red-500/30
          border-2 border-red-400/30
          transition-all duration-300 transform hover:scale-110
          group
        "
      >
        <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse opacity-0 group-hover:opacity-20" />
        <PhoneOff className="h-7 w-7 md:h-8 md:w-8 text-white transition-transform duration-300 group-hover:scale-110" />
      </Button>

      <Button
        onClick={onToggleVideo}
        variant={isVideoEnabled ? 'default' : 'secondary'}
        className={`
          relative rounded-full w-14 h-14 md:w-16 md:h-16 p-0 
          transition-all duration-300 transform hover:scale-110
          ${isVideoEnabled 
            ? 'bg-white/15 hover:bg-white/25 border-white/20' 
            : 'bg-red-500/20 hover:bg-red-500/30 border-red-500/30'
          }
          backdrop-blur-xl border shadow-lg
          hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]
          group
        `}
      >
        <div className="relative">
          {isVideoEnabled ? (
            <Video className="h-6 w-6 md:h-7 md:w-7 text-white transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <VideoOff className="h-6 w-6 md:h-7 md:w-7 text-red-500 transition-transform duration-300 group-hover:scale-110" />
          )}
          <div className={`
            absolute -inset-2 rounded-full 
            ${isVideoEnabled ? 'bg-white/5' : 'bg-red-500/5'} 
            animate-ping
          `} />
        </div>
      </Button>
    </div>
  );
}