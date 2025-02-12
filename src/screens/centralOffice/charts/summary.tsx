
import { useSpring, animated } from "react-spring";
function Summary({result}:any) {

    const withdrawSpring = useSpring({
        from: { number: 0 },
        number: result ? result.withdraw : 0,
        delay: 180,
        config: { mass: 1, tension: 180, friction: 12 },
      });
    

    const operationalSpring = useSpring({
        from: { number: 0 },
        number: result ? result.operational : 0,
        delay: 100,
        config: { mass: 1, tension: 180, friction: 12 },
      });
    
      const developmentSpring = useSpring({
        from: { number: 0 },
        number: result ? result.development : 0,
        delay: 140,
        config: { mass: 1, tension: 180, friction: 12 },
      });
    
      const trainingSpring = useSpring({
        from: { number: 0 },
        number: result ? result.trainingOrOthers : 0,
        delay: 160,
        config: { mass: 1, tension: 180, friction: 12 },
      });
  return (
    <div className=" md:mr-2 mr-5">
       <div className=" flex flex-col justify-end items-end  ">
          <h1 className=" font-gextrabold text-green-400 text-4xl drop-shadow-sm">
            <animated.span>
              {operationalSpring.number.to((n) => n.toFixed(0))}
            </animated.span></h1>
          <p className="  text-[7px] font-gsemibold " >OPERATIONAL</p>
        </div>

        <div className=" flex flex-col justify-end items-end ">
          <h1 className=" font-gextrabold text-yellow-400 text-4xl">
            <animated.span>
              {developmentSpring.number.to((n) => n.toFixed(0))}
            </animated.span></h1>
          <p className="  text-[7px] font-gsemibold " >DEVELOPMENTAL</p>
        </div>

        <div className=" flex flex-col justify-end items-end ">
          <h1 className=" font-gextrabold text-orange-600 text-4xl">
            <animated.span>
              {trainingSpring.number.to((n) => n.toFixed(0))}
            </animated.span>
            </h1>
          <p className="  text-[7px] font-gsemibold " >FOR TRAINING/OTHERS</p>
        </div>

        <div className=" flex flex-col justify-end items-end ">
          <h1 className=" font-gextrabold text-red-600 text-4xl"><animated.span>
              {withdrawSpring.number.to((n) => n.toFixed(0))}
            </animated.span></h1>
          <p className="  text-[7px] font-gsemibold " >WITHDRAW</p>
        </div>
     
       
 </div>
  )
}

export default Summary