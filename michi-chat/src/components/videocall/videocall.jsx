import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const socket = io('http://localhost:5000'); // Conectar al servidor backend
import './videocall.css'

const VideoCall = () => {
  const { roomId, username, me } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [roomIdOG, setRoomId] = useState(roomId);
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [started, setStarted] = useState(false);
  const navigate = useNavigate(); // Hook para navegar a la ruta de la llamada
  useEffect(() => {
    // Configurar eventos de Socket.IO al montar el componente
    socket.on('offer', async (offer) => {
      if (!peerConnection) return;

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('answer', roomIdOG, answer);
    });

    socket.on('answer', (answer) => {
      peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('candidate', (candidate) => {
      peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    if (started === false) {
      startVideoCall();
      setStarted(true);
    }

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('candidate');
    };
  }, [peerConnection, roomIdOG]);

  const startVideoCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    setLocalStream(stream);

    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', roomIdOG, event.candidate);
      }
    };

    socket.emit('join-room', roomIdOG);

    pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', roomIdOG, offer);
    };
  };

  // Función para colgar la llamada
  const hangUp = () => {
    if (peerConnection) {
      peerConnection.close();  // Cerrar la conexión peer-to-peer
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());  // Detener las pistas locales
    }
    socket.emit('leave-room', roomIdOG);  // Notificar al servidor que el usuario dejó la sala
    setPeerConnection(null);  // Limpiar el estado
    setLocalStream(null);  // Limpiar el flujo local
    navigate('/main')
  };

  return (
    <div className='videoCall'>
      <div className="my-video">
        <img className='logov' src="/src/assets/logo_medium.png" alt="" />
        <img className='gato-sentado' src="/src/assets/gato_sentado.png" alt="" />
        <div className="video-and-name">
          <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '400px' }} />
          <p>{me}</p>
        </div>
        <img className='huellas' src="/src/assets/huellas.png" alt='' />
      </div>
      <div className="remote-video">
        <video ref={remoteVideoRef} autoPlay playsInline  />
        <p>{username}</p>
      <button onClick={hangUp} style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>
        Colgar
      </button>
      </div>
    </div>
  );
};

export default VideoCall;
