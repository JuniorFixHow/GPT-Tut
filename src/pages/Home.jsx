import React, { useEffect, useState } from 'react';
import {FcAndroidOs} from 'react-icons/fc'
import {FaUser} from 'react-icons/fa'
import axios from 'axios';
import {BsFillMicFill, BsFillMicMuteFill} from 'react-icons/bs';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import './home.css';

const Home = () => {
    const [black, setBlack] = useState(true);
    const [userState, setUserState] = useState('Idle');
    const [aiState, setAiState] = useState('Idle');
    const [aiFeedback, setAiFeedback] = useState('');
    const [userInput, setUserInput] = useState('');
    const [message, setMessage] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);
    const [timer, setTimer] = useState(null);

    const url = 'http://localhost:5000/api';

    const userType = (e)=>{
        if(e.target.value !==''){
            setUserState('Typing');
            clearTimeout(timer);
            const newTimer = setTimeout(()=>{
                setUserState('Thinking')
            }, 5000);

            setTimer(newTimer);
        }
        else{
            setUserState('Thinking')
        }
    }

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable,
    } = useSpeechRecognition();

    const handleSubmit =async (e)=>{
        e.preventDefault();

        SpeechRecognition.stopListening();
        setAiFeedback('');
        setAiState('Thinking');
        setUserState('Waiting');

        if(message === ''){
            setIsEmpty(true);
            setUserState('Idle');
            setAiState('Idle');
        }
        else{
            const data = {
                prompt:message
            }

            try {
                const response = await axios.post(url, data);
                setAiState('Idle');
                setUserState('Idle');
                setUserInput(message);

                document.getElementById('myform').reset();

                let chatbox = document.getElementById('feed');
                let newData = response.data.ai;

                if(response.status ===200){
                    let index = 0;
                    let interval =  setInterval( ()=> {
                        if(index < newData.length){
                            chatbox.innerHTML += newData.charAt(index);
                            setAiFeedback(undefined);
                            index ++;
                        }
                        else{
                            clearInterval(interval);
                        }
                    }, 20);
                    setUserState('Reading');
                }
                else{
                    setAiFeedback('Error occured in the operation')
                }
            } catch (err) {
                console.log(err);
                setAiState('Idle');
            }
        }
    }

    const textToSpeech = ()=>{
        resetTranscript();
        if(!browserSupportsSpeechRecognition){
            alert("Browser doesn't support speech recognition.");
        }
        else{
            try {
                SpeechRecognition.startListening({
                    continuous:true
                });
                setUserState('Recording');
            } catch (err) {
                console.log(err);
            }
        }
    }

    const textToStop = async()=>{
        SpeechRecognition.stopListening();
        setAiFeedback('');
        setAiState('Thinking');
        setUserState('Waiting');

        if(transcript === ''){
            setIsEmpty(true);
            setUserState('Idle');
            setAiState('Idle');
            alert('Nothing recorded. Try again \nIn some cases, unsupported browsers can cause this');
        }
        else{
            const data = {
                prompt:transcript
            }

            try {
                const response = await axios.post(url, data);
                setAiState('Idle');
                setUserState('Idle');
                setUserInput(message);

                document.getElementById('myform').reset();

                let chatbox = document.getElementById('feed');
                let newData = response.data.ai;

                if(response.status ===200){
                    let index = 0;
                    let interval =  setInterval( ()=> {
                        if(index < newData.length){
                            chatbox.innerHTML += newData.charAt(index);
                            setAiFeedback(undefined);
                            index ++;
                        }
                        else{
                            clearInterval(interval);
                        }
                    }, 20);
                    setUserState('Reading');
                }
                else{
                    setAiFeedback('Error occured in the operation')
                }
            } catch (err) {
                console.log(err);
                setAiState('Idle');
            }
        }
    }

    useEffect(()=>{
        const keyDownHandler = e=>{
            if(e.key === 'Enter'){
                handleSubmit();
            }
        }
        document.addEventListener('keydown', keyDownHandler);
        return ()=>{
            document.removeEventListener('keydown', keyDownHandler);
        }
    }, [])
    return (
        <div className='home' >
            <div className="top">
                <span onClick={()=>window.open('https://github.com/JuniorFixHow/GPT-Tut', '_blank')} className="left">Make this page better</span>
                <div onClick={()=>setBlack(!black)} className={black? 'white-box':'black-box'} ></div>
            </div>

            <div className={black? 'center': 'center-white'} >
                <div className="actions">
                    <div className="user">
                        <FaUser className={black? 'user-icon':'user-icon-white' } />
                        <span className={black? 'user-question' : 'user-question-white'} > {userState} </span>
                    </div>

                    <div className="ai">
                        <FcAndroidOs className='ai-icon' />
                        <span className={black? 'ai-answer' : 'ai-answer-white'} > {aiState} </span>
                    </div>

                    <div className="data">
                        <span className={black? 'question' : 'question-white'} > {listening? transcript:userInput} </span>
                        <span className={black? 'answer' : 'answer-white'} id='feed' >{aiFeedback}</span>
                    </div>
                </div>

                <div className="down">
                    <form onSubmit={handleSubmit} id='myform' >
                        <input type="text" className={black? 'text-input':'text-input-white'} id='message'
                         onChange={(e)=>setMessage(e.target.value)}
                         onFocus={(e)=>setUserState('Thinking')}
                         onBlur={(e)=>setUserState('Idle')}
                         onInput = {userType}
                         placeholder ={isEmpty ? '* Required' : 'Ask your question...'}
                         />

                         {
                             listening?
                             <BsFillMicMuteFill onClick={textToStop} className='mute' />
                             :
                             <BsFillMicFill onClick={textToSpeech} className={black? 'talk':'talk-white'} />
                         }
                    </form>
                </div>
            </div>


        </div>
    )
}

export default Home
