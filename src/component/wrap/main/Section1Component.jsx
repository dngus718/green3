/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';

export default function Section1Component() {

    // 인디게이터 버튼 on 
    // true, false 배열 상태변수 설정
    const [slide, setSlide] = useState({
        메인슬라이드:[]
    })
    const [link, setLink] = useState({
        바로가기:[]
    })
    const [page, setPage] = useState(Array(3).fill(false));

    const slideWrap = useRef();
    const [stop, setStop] = useState('play');
    const [cnt, setCnt] = useState(0);
    const [id, setId] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [mouseDown, setMouseDown] = useState(null);
    const [mouseUp, setMouseUp] = useState(null);
    const [dragStart, setDragStart] = useState(null);
    const [ease, setEase] = useState({
        easeInOutExpo     : 'cubic-bezier(1,0,0,1)',
    });    
    
    // 바로가기 
    useEffect(()=>{
        fetch('./json/section1.json',{
            method:'GET'
        })
        .then((res)=>res.json())
        .then((data)=>{
            setLink({
                바로가기:data.바로가기
            })
        }).catch(()=>{
            console.log("에러")
        })
    })


    // 메인슬라이드 패치
    useEffect(()=>{
        fetch('./json/main_slide.json',{
            method:'GET'
        })
        .then((res)=>res.json())
        .then((data)=>{
            setSlide({
                메인슬라이드:data.메인슬라이드
            })
        }).catch(()=>{
            console.log("에러")
        })
    })

    // 1-1. 메인슬라이드 함수
    function mainSlide(){
        slideWrap.current.style.transition =`transform 0.6s ${ease.easeInOutExpo}`;
        slideWrap.current.style.transform = `translateX(${-1703 * cnt}px)`; 
        
        let imsi = Array(3).fill(false);   // imsi[false, false, false]
        imsi[cnt===3?0:(cnt===-1?2:cnt)] = true;  // imsi[false, true, false]
        if(imsi.length===3){
            setPage(imsi);
        }        
    }

    // 1-2. 메인슬라이드 함수 리턴
    // 트랜지션이 끝나면 즉시 리턴 처음으로
    // 드래그하기 이전에 리턴이된다. 
    const onTransitionEndEvent=()=>{
        if(cnt>2){ // n-1 =>  3-1=2
            slideWrap.current.style.transition =`none`;
            slideWrap.current.style.transform = `translateX(${-1703 * 0}px)`;
            setTimeout(()=>{
                setCnt(0);
            }, 10);
        }
        else if(cnt<0){ // n-1 =>  3-1=2 
            slideWrap.current.style.transition =`none`;
            slideWrap.current.style.transform = `translateX(${-1703 * 2}px)`;
            setTimeout(()=>{ // 초기화 2
                setCnt(2);
            }, 10);
        }
    }



    // 메인함수 호출 실행은
    // 상태변수 cnt 변화에 따라 변경된다.
    // cnt 변화를 감시하는 감시프로그램 훅
    useEffect(()=>{
        mainSlide();
    },[cnt])


    // 2. 다음카운트 함수
    function nextCount(){
        setCnt(cnt=>cnt+1);  
    }
   
    // 2. 이전카운트 함수
    function prevCount(){
        setCnt(cnt=>cnt-1);        
    }

    // 3. 자동타이머 함수
    //    4초간격으로 실행하는 타이머
    function autoTimer(){             
        const imsi = setInterval(()=>{
            nextCount();
            // prevCount();
        }, 4000);  // Delay Time 4초 간격
        setId( imsi ); // 상태변수(컴포넌트의 전역변수)에 저장
        return ()=> clearInterval(imsi);
    }

    // 4. 로딩시 자동타이머호출 실행 이펙트 훅
    //    슬라이드컨테이너에 마우스오버시 일시정지 setStop('stop')
    //    슬라이드컨테이너에 마우스아웃시 자동타이머 플레이 setStop('play')
    useEffect(()=>{
        if(stop==='play'){
            clearInterval(id);
            autoTimer();
        }
        else {
            clearInterval(id);
        }        
    }, [stop]);

    // 6. 터치시작
    //    선택자 슬라이드컨테이너
    //    마우스다운 이벤트 => 터치시작
    const onMouseDownSlideContainer=(e)=>{
        clearInterval(id);
        setMouseDown('down');      // 터치 시작 '다운'
        setTouchStart( e.clientX ) // 터치 시작 좌표 값

        // 드래그시작 좌표값 = e.clientX - (슬라이드랩퍼박스.left + 슬라이드너비 - 좌측헤더200)
        let drgStart = e.clientX - (slideWrap.current.getBoundingClientRect().left + 1703 - 200);
        setDragStart(drgStart);
    }

    //  7. 마우스다운 => 'down' 이면
    //     문서전체에서 마우스업 이벤트 발생 시킨다.
    useEffect(()=>{
        if(mouseDown==='down'){
            function mouseupFn(e){
                setMouseUp('up');
                setTouchEnd(e.clientX);
                // 도큐먼트 업이벤트 버블링 발행 이벤트 제거  
                // 예외처리 리액트에서 버블링 발생
                // removeEventListener() 이벤트제거
                // addEventListener()    이벤트등록               
                document.removeEventListener('mouseup', mouseupFn); // 이벤트제거
            }
            document.addEventListener('mouseup', mouseupFn);
        }
    }, [mouseDown]);


    // 8. 마우스 업 이벤트 발생하면
    // 터치시작좌표 - 터치끝좌표 
    // 다음카운트함수, 이전카운트함수 구분 실행
    // 0 보다 크면 다음카운트
    // 0 보다 작으면 이전카운트
    // 9. ok 이면 모두 초기화
    useEffect(()=>{
        if(mouseUp==='up'){

            if((touchStart-touchEnd) > 200){
                nextCount();
            }            
            if((touchStart-touchEnd) < -200){
                prevCount();
            }

            // 200 이하  -200이상 범위는 다시 제자리로 돌아가게 한다.
            if( ((touchStart-touchEnd) <= 200)  &&   ((touchStart-touchEnd) >= -200) ){
                mainSlide();
            }

            setMouseUp('ok');
        }
        else if(mouseUp==='ok'){  
            // 마우스 터치 스와이프가 모두 끝나면
            // 모든 상태변수 초기화
            setMouseDown(null);
            setMouseUp(null);
            setTouchStart(null);
            setTouchEnd(null);

            if(stop.includes('play')){
                autoTimer();
            }            
        }
    },[mouseUp]); // 의존성 배열


    // 10. 드래그 앤 드롭 => 마우스무브 => 잡고 끌고 그리고 놓는다.
    //     슬라이드컨테이버 선택자를 => 마우스무브
    //     마우스다운  => 마우스무브 => 마우스업 끝
    //     1. 마우스 다운이 되어야 진행한다. 아니면 리턴 취소
    //     2. 마우스무브시작좌표 dragStart  setDragStart 상태변수
    //     3. 마우스무브의끝좌표 dragEnd = e.clientX => 변수없이 바로 사용
    //     4. 마우스무브의끝좌표 - 마우스무브시작좌표 => 드래그이동
    //     5. 예외발생 => 우측 끝 첫번째 슬라이드 드래그하고 리턴 되기전 우측에 슬라이드가 없어서 흰색배경보임
    //     6. 혜결 => 그러면 우측끝이 보이기전에 리턴하면된다. 2 0 1 2 1
    const onMouseMoveSlideContainer=(e)=>{
        if(mouseDown!=='down') return;
        slideWrap.current.style.transition = 'none';
        slideWrap.current.style.transform = `translateX(${e.clientX - dragStart}px)`;

    }

    // 페이지 버튼(이디게이터 Indicator 버튼) 클릭 이벤트
    const onClickPageBtn=(e, n)=>{
        e.preventDefault();
        setCnt( n );
    }


    // 플레이 일시정지 버튼 클릭 이벤트
    const onClickPlayPauseBtn=(e)=>{
        e.preventDefault();
       setStop(stop.includes('play')?'stop':'play');
       // setStop(!stop); // true false  토글방식
    }

    return (
        <section 
            id="section1"
        >
            <div 
                className="slide-container"               
                onMouseDown={onMouseDownSlideContainer}
                onMouseMove={onMouseMoveSlideContainer}
            >
                <div className="slide-view">
                    <ul 
                        className="slide-wrap" 
                        ref={slideWrap}
                        onTransitionEnd={onTransitionEndEvent}
                    >
                        {
                            slide.메인슬라이드.map((item)=>
                                <li className={`slide ${item.클래스}`} key={item.글번호}>
                                    <a href="!#" title={item.타이틀}>
                                        <img src= {item.이미지} alt={item.타이틀}/>
                                        <h2>
                                            <span>{item.타이틀}</span>
                                        </h2>
                                    </a>
                                </li>
                            )                            
                        }
                    </ul>
                </div>

              

            </div>
            <div className="link" id="link">
                <ul>
                    {
                        link.바로가기.map((item)=>{
                            if(item.타이틀!==""){
                                return(
                                    <li key={item.글번호}>
                                    <a href="!#" title={item.타이틀}>
                                        <img src={item.이미지} alt={item.타이틀}/>
                                    </a>
                                </li>  
                                )                             
                            }
                            else{
                                return(
                                    <li key={item.글번호}>
                                        <i></i>
                                    </li>
                                )                                  
                            }                                                                                              
                       })
                    }
                </ul>
            </div>

              {/* 인디게이터 버튼 &&  페이지버튼 */}
           `   <div className="page-btn-box">
                <span>
                    {
                    

                        // page.map((item, idx)=>{
                        //     return (
                        //         <a 
                        //             key={idx}
                        //             onClick={(e)=>onClickPageBtn(e, idx)} 
                        //             href="!#" 
                        //             // className={`page-btn1 blind${page[idx] ?' on':''}`}
                        //             className={`page-btn1 blind${item ?' on':''}`}
                        //         >버튼1</a>
                        //     )
                        // })
                    
                        page.map((item, idx)=>
                            <a 
                                key={idx}
                                onClick={(e)=>onClickPageBtn(e, idx)} 
                                href="!#" 
                                // className={`page-btn1 blind${page[idx] ?' on':''}`}
                                className={`page-btn1 blind${item ?' on':''}`}
                            >버튼1</a>
                        )    
                    }
                </span>

                <strong>
                    <a onClick={onClickPlayPauseBtn}
                        href="!#" 
                       className={`play-pause blind${stop.includes('play')?'':' on'}`}
                    >일시정지 & 플레이</a>
                </strong>    

              </div>`



        </section>
    );
}