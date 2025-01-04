'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useWebRTC } from '@/hooks/useWebRTC';
import { CallControls } from '@/components/CallControls';
import { Copy, ArrowRight, Smile, Heart, ThumbsUp, Star, PartyPopper} from 'lucide-react';



const REACTIONS = [
  { emoji: '👍', Icon: ThumbsUp, label: 'thumbs-up' },
  { emoji: '❤️', Icon: Heart, label: 'heart' },
  { emoji: '⭐', Icon: Star, label: 'star' },
  { emoji: '🎉', Icon: PartyPopper, label: 'party' },
  { emoji: '😊', Icon: Smile, label: 'smile' },
];

const EmojiReaction = ({ emoji, position }: { emoji: string; position: number }) => {
  return (
    <div
      className="absolute text-4xl transform transition-all duration-2000 animate-float"
      style={{
        left: `${position}%`,
        bottom: '100%',
      }}
    >
      {emoji}
    </div>
  );
};

const EmojiReactions = ({ 
  onSendReaction, 
  reactions 
}: { 
  onSendReaction: (emoji: string) => void;
  reactions: { emoji: string; timestamp: number }[];
}) => {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div className="relative">
      {/* Floating reactions */}
      <div className="absolute bottom-full w-full h-48 pointer-events-none">
        {reactions.map((reaction, index) => (
          <EmojiReaction
            key={`${reaction.emoji}-${index}`}
            emoji={reaction.emoji}
            position={Math.random() * 80 + 10}
          />
        ))}
      </div>

      {/* Reaction button and panel */}
      <div className="relative">
        <Button
          variant="ghost"
          className="rounded-full p-2 hover:bg-white/20"
          onClick={() => setShowPanel(!showPanel)}
        >
          <Smile className="h-6 w-6 text-white" />
        </Button>

        {/* Emoji panel */}
        {showPanel && (
          <div className="absolute bottom-full mb-2 left-0 bg-white/10 backdrop-blur-xl rounded-xl p-2 flex gap-1 border border-white/20">
            {REACTIONS.map((reaction) => (
              <Button
                key={reaction.label}
                variant="ghost"
                className="rounded-full p-2 hover:bg-white/20"
                onClick={() => {
                  onSendReaction(reaction.emoji);
                  setShowPanel(false);
                }}
              >
                <span className="text-xl">{reaction.emoji}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function VideoCall() {
  const [remotePeerId, setRemotePeerId] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const {
    localVideoRef,
    remoteVideoRef,
    startCall,
    joinCall,
    endCall,
    peerId,
    localStream,
    isConnecting,
    reactions,
    sendReaction
  } = useWebRTC();

  const handleStartCall = async () => {
    try {
      const myPeerId = await startCall();
      if (myPeerId) {
        toast({
          title: 'Call Initialized',
          description: `Your Peer ID: ${myPeerId}. Share this ID with the person you want to call.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to initialize call',
        variant: 'destructive',
      });
    }
  };

  const handleJoinCall = async () => {
    if (!remotePeerId) {
      toast({
        title: 'Error',
        description: 'Please enter a Peer ID',
        variant: 'destructive',
      });
      return;
    }

    try {
      await joinCall(remotePeerId);
      toast({
        title: 'Joining Call',
        description: 'Connecting to peer...',
      });
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: error instanceof Error ? error.message : 'Failed to connect to peer',
        variant: 'destructive',
      });
    }
  };

  const handleToggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const handleToggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const handleEndCall = () => {
    endCall();
    toast({
      title: 'Call Ended',
      description: 'You have left the call',
    });
  };

  const handleCopyPeerId = () => {
    navigator.clipboard.writeText(peerId);
    toast({
      title: 'Copied!',
      description: 'Peer ID copied to clipboard',
    });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Main Remote Video */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/90">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover rounded-3xl shadow-2xl"
        />
      </div>

      {/* Local Video */}
      <div className="absolute top-6 right-6 w-[320px] aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-lg transition-all hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Connection Panel */}
      <div className="absolute top-6 left-6 max-w-md">
        {!peerId ? (
          <Button
            onClick={handleStartCall}
            disabled={isConnecting}
            className="group w-full bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white rounded-2xl px-8 py-6 h-auto border border-white/20 transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="text-lg font-semibold">
              {isConnecting ? 'Initializing...' : 'Start a New Call'}
            </span>
          </Button>
        ) : (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-4 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-2">
              <Input
                value={peerId}
                readOnly
                className="bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-white/20"
              />
              <Button
                onClick={handleCopyPeerId}
                variant="ghost"
                className="hover:bg-white/10 rounded-xl p-3"
              >
                <Copy className="h-5 w-5 text-white" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter Peer ID to call"
                value={remotePeerId}
                onChange={(e) => setRemotePeerId(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-white/20"
                disabled={isConnecting}
              />
              <Button
                onClick={handleJoinCall}
                disabled={isConnecting || !remotePeerId}
                className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-6 flex items-center space-x-2 transition-all hover:scale-105"
              >
                <span>{isConnecting ? 'Connecting...' : 'Call'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-0 inset-x-0 h-40">
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 shadow-2xl flex items-center space-x-4">
            <CallControls
              isAudioEnabled={isAudioEnabled}
              isVideoEnabled={isVideoEnabled}
              onToggleAudio={handleToggleAudio}
              onToggleVideo={handleToggleVideo}
              onEndCall={handleEndCall}
            />
            <div className="w-px h-8 bg-white/20" /> {/* Divider */}
            <EmojiReactions 
              onSendReaction={sendReaction}
              reactions={reactions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}