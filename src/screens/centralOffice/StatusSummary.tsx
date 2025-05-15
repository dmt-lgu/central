import { useSpring, animated } from "react-spring";
import { useSelector } from 'react-redux';
import { selectData } from '@/redux/dataSlice';
import { useEffect, useState } from "react";

interface StatusCounts {
  operational: number;
  development: number;
  trainingOrOthers: number;
  withdraw: number;
}

function Summary() {
  const data = useSelector(selectData);
  const [counts, setCounts] = useState<StatusCounts>({
    operational: 0,
    development: 0,
    trainingOrOthers: 0,
    withdraw: 0
  });

  useEffect(() => {
    const calculateTotalValues = () => {
      let operationalTotal = 0;
      let developmentalTotal = 0;
      let trainingTotal = 0;
      let withdrawTotal = 0;

      Object.entries(data).forEach(([_permitType, serviceData]: [string, any]) => {
        if (serviceData.length > 0) {
          const mostRecentData = serviceData[serviceData.length - 1];
          
          mostRecentData.data.forEach((regionData: any) => {
            operationalTotal += regionData.operational;
            developmentalTotal += regionData.developmental;
            trainingTotal += regionData.training;
            withdrawTotal += regionData.withdraw;
          });
        }
      });

      setCounts({
        operational: operationalTotal,
        development: developmentalTotal,
        trainingOrOthers: trainingTotal,
        withdraw: withdrawTotal
      });
    };

    calculateTotalValues();
  }, [data]);

  const withdrawSpring = useSpring({
    from: { number: 0 },
    number: counts.withdraw,
    delay: 180,
    config: { mass: 1, tension: 180, friction: 12 },
  });

  const operationalSpring = useSpring({
    from: { number: 0 },
    number: counts.operational,
    delay: 100,
    config: { mass: 1, tension: 180, friction: 12 },
  });

  const developmentSpring = useSpring({
    from: { number: 0 },
    number: counts.development,
    delay: 140,
    config: { mass: 1, tension: 180, friction: 12 },
  });

  const trainingSpring = useSpring({
    from: { number: 0 },
    number: counts.trainingOrOthers,
    delay: 160,
    config: { mass: 1, tension: 180, friction: 12 },
  });

  return (
    <div className="md:mr-2 mr-5">
      <div className="flex flex-col justify-end items-end">
        <h1 className="font-gextrabold text-green-400 text-4xl drop-shadow-sm">
          <animated.span>
            {operationalSpring.number.to((n) => n.toFixed(0))}
          </animated.span>
        </h1>
        <p className="text-[7px] font-gsemibold">OPERATIONAL</p>
      </div>

      <div className="flex flex-col justify-end items-end">
        <h1 className="font-gextrabold text-yellow-400 text-4xl">
          <animated.span>
            {developmentSpring.number.to((n) => n.toFixed(0))}
          </animated.span>
        </h1>
        <p className="text-[7px] font-gsemibold">DEVELOPMENTAL</p>
      </div>

      <div className="flex flex-col justify-end items-end">
        <h1 className="font-gextrabold text-orange-600 text-4xl">
          <animated.span>
            {trainingSpring.number.to((n) => n.toFixed(0))}
          </animated.span>
        </h1>
        <p className="text-[7px] font-gsemibold">FOR TRAINING/OTHERS</p>
      </div>

      <div className="flex flex-col justify-end items-end">
        <h1 className="font-gextrabold text-red-600 text-4xl">
          <animated.span>
            {withdrawSpring.number.to((n) => n.toFixed(0))}
          </animated.span>
        </h1>
        <p className="text-[7px] font-gsemibold">WITHDRAW</p>
      </div>
    </div>
  );
}

export default Summary;