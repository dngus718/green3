import React, { useEffect,useState } from 'react';
import axios from 'axios';

export default function Section2Component() {

    const [state, setState] = useState({
        "글번호":null,
        "타이틀":null,
        "이미지":null,
        "내용":null
    });

    useEffect(()=>{
        axios({
            url:'./json/section2.json',
            method:'GET'
        })
        .then((res)=>{
            setState({
                "글번호": res.data.베너.글번호,
                "타이틀": res.data.베너.타이틀,
                "이미지": res.data.베너.이미지,
                "내용": res.data.베너.내용
            })       
        })
        .catch((err)=>{
            console.log("에러")
        });
    },[])

    return (
        <section id="section2">
            <div className="container">
                <a href="!#">
                    <div className="content">                    
                        <div className="col1">
                            <img src={state.이미지} alt="banner"/>
                        </div>
                        <div className="col2">
                            <h2>{state.타이틀}</h2>                            
                            <p>{state.내용}</p>
                        </div>
                    </div>

                    <span className="arrow-btn btn1"></span>
                    <span className="arrow-btn btn2"></span>
                    
                </a>
            </div>
        </section>
    );
}