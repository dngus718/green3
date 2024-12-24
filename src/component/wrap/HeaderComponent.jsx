import React, { useEffect } from 'react';
import axios from 'axios';

export default function HeaderComponent() {

    const [state, setState] = React.useState({
        메인메뉴:{}
    })

    const [sub, setSub] = React.useState(Array(4).fill(false));

    // 네비게이션 가져오기
    useEffect(()=>{
        axios({
            url:'./json/nav.json',
            method:'GET'
        })
        .then((res)=>{
            setState({
                메인메뉴: res.data.메인메뉴
            })
        })
        .catch((err)=>{
            console.log('axios rest api 실패')
            console.log(err)
        })
    },[])

    // 메인메뉴 바인딩 테스트
    useEffect(()=>{
        // 1. 메인메뉴만 출력
        // jsx에서 적합하지않다.
        // 반복문 for in 객체
        //for(let item in state.메인메뉴){
        //    console.log(item)
        // }
        // 객체를 지정하는 방식
        // . 점표기법
        // console.log(state.메인메뉴['OnSale'])
        // console.log(state.메인메뉴['기획전'])
        // console.log(state.메인메뉴['푸른마을 레시피'])
        // console.log(state.메인메뉴['매장안내'])
        // 2. 키 , 밸류
        // console.log(Object.keys(state.메인메뉴))

        // console.log(Object.values(state.메인메뉴))

        Object.keys(state.메인메뉴).map((item,idx)=>{
            return console.log(idx, item)
        })

        Object.keys(state.메인메뉴).map((item,idx)=>{
            return console.log(idx, item, state.메인메뉴[item].length)
        })


    },[state.메인메뉴])


    const onMouseEnterMainBtn=(e, number)=>{
        let imsi = Array(4).fill(false);

        imsi[number] = true;
        setSub(imsi);

    }

    const onMouseLeaveMainBtn=()=>{
        const imsi = Array(4).fill(false);
        setSub(imsi);
    }



    return (
        <header id="header" className="">
            <div className="row1">
                <h1><a href="./" title="푸른마을"><span>푸른</span><em>마을</em></a></h1>
                <div className="mobile-bnt-box">
                    <a href="!#" className="mobile-bnt">
                        <i className="line line1"></i>
                        <i className="line line2"></i>
                        <i className="line line3"></i>
                    </a>
                </div>
            </div>
            <div className="row2">
                <nav id="nav">
                    <ul onMouseLeave={onMouseLeaveMainBtn}>
                        {                          
                               Object.keys(state.메인메뉴).map((item, idx)=>

                                    <li key={item}>
                                        <a href="!#" className="main-btn" title="OnSale"  onMouseEnter={(e)=>onMouseEnterMainBtn(e, idx)} >{item}</a>
                                        {
                                            sub[idx] &&     
                                            <div className="sub sub1">
                                                <ul>
                                                    {
                                                        state.메인메뉴[item].map((item2, idx2)=>
                                                            <li key={idx2}> 
                                                                {
                                                                    item2.map((item3, idx3)=>
                                                                    <span key={idx3}>
                                                                        <a href="!#">{item3}</a>
                                                                    </span>
                                                                    )
                                                                }
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        }
                                    </li>
                            )                                          
                        }
                    </ul>
                </nav>
            </div>
        </header>
    );
}