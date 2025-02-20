import { ThemeProvider } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import viteLogo from "/DICT.png";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ChevronUp, ListFilter, MenuIcon, X } from "lucide-react";
import LGUServiceDropdown from "./screens/centralOffice/testing/ServicesList";
import DataPresentationOptions from "./screens/centralOffice/testing/DataPresentationOptions";
import Profile from "./assets/Layer_1@2x.png";
import axios from "./plugin/axios";
import { useDispatch, useSelector } from 'react-redux';
import { selectRegions } from './redux/regionSlice';
import { selectProject } from "./redux/projectSlice";

import { setData } from "./redux/dataSlice";
import { selectDate } from "./redux/dateSlice";




interface LguDetails {
  id: string;
  lguName: string;
  status: string;
  progressRate: string;
  concerns: string;
  actionItems: string;
  otherRemarks: string;
  universalStatus: string;
  mpar: string;
  geocode: string;
  name: string;
  province: string;
  region: string;
  district: string;
  level: string;
  incomeClass: string;
  dictRo: string;
}

interface MonthlyData {
  BP?: Array<{
    date: string;
    values: LguDetails[];
  }>;
  CO?: Array<{
    date: string;
    values: LguDetails[];
  }>;
  WP?: Array<{
    date: string;
    values: LguDetails[];
  }>;
  BC?: Array<{
    date: string;
    values: LguDetails[];
  }>;
}

function App() {
  const regionss = useSelector(selectRegions);
  const services = useSelector(selectProject);
  const dates = useSelector(selectDate);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Reports", path: "/central/reports" },
    { name: "Utilization Status", path: "/central/utilization" },
    { name: "LGU", path: "/central/lgu" }
  ];

  const [monthlyStats, setMonthlyStats] = useState<MonthlyData>({});

  const filterMonthlyStatsByDates = (stats: MonthlyData, selectedDates: string[], selectedRegions: string[]) => {
    if (!selectedDates?.length || !stats) {
      console.log('No dates or stats to filter');
      return stats;
    }

    const sortedDates = [...selectedDates].sort();
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];
    
    const [startYear, startMonth] = startDate.split('-').map(Number);
    const [endYear, endMonth] = endDate.split('-').map(Number);

    const months: string[] = [];
    let currentDate = new Date(startYear, startMonth - 1);
    const endDateTime = new Date(endYear, endMonth - 1);

    while (currentDate <= endDateTime) {
      months.push(
        `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
      );
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    const filtered: any = {};
    
    Object.entries(stats).forEach(([service, data]) => {
      if (!data) return;
      
      filtered[service] = data
        .filter((monthData: any) => months.includes(monthData.date))
        .map((monthData: any) => {
          const regionCounts: any = {};

          // Count universal statuses by dictRo
          monthData.values.forEach((item: any) => {
            if (selectedRegions.includes(item.dictRo)) {
              if (!regionCounts[item.dictRo]) {
                regionCounts[item.dictRo] = {
                  operational: 0,
                  developmental: 0,
                  training: 0,
                  withdraw: 0
                };
              }

              switch (item.universalStatus) {
                case '[A] Operational':
                  regionCounts[item.dictRo].operational++;
                  break;
                case '[B] Developmental':
                  regionCounts[item.dictRo].developmental++;
                  break;
                case '[C] For Training/Others':
                  regionCounts[item.dictRo].training++;
                  break;
                case '[D] Withdraw':
                  regionCounts[item.dictRo].withdraw++;
                  break;
              }
            }
          });

          return {
            date: monthData.date,
            data: Object.entries(regionCounts).map(([region, counts]: any) => ({
              region,
              ...counts
            }))
          };
        })
        .sort((a: any, b: any) => a.date.localeCompare(b.date));
    });

    return filtered;
  };

  useEffect(() => {
    if (dates && dates.length > 0 && monthlyStats) {
      const filtered = filterMonthlyStatsByDates(monthlyStats, dates, regionss);
      dispatch(setData(filtered));
      console.log('Filtered Monthly Stats:', filtered); 
    }
  }, [monthlyStats, dates, regionss]);
 
  function getBP() {
    axios.get('18kaPQlN0_kA9i7YAD-DftbdVPZX35Qf33sVMkw_TcWc/values/BP1 UR Input', {
      headers: {
        Authorization: `Token ${import.meta.env.VITE_TOKEN}`,
      }
    }).then((response) => {
      const data = response.data.values;
      const records = data.slice(3);
      
      const groupedByMonth = records.reduce((acc: any, row: any) => {
        const period = row[1];
        
        const lguDetails = {
          id: row[0],
          lguName: row[4],
          status: row[5],
          progressRate: row[6],
          concerns: row[7],
          actionItems: row[8],
          otherRemarks: row[9],
          universalStatus: row[10],
          mpar: row[11],
          geocode: row[12],
          name: row[13],
          province: row[14],
          region: row[15],
          district: row[16],
          level: row[17],
          incomeClass: row[18],
          dictRo: row[19]
        };
  
        if (!acc[period]) {
          acc[period] = {
            date: period,
            values: []
          };
        }
  
        acc[period].values.push(lguDetails);
        return acc;
      }, {});
  
      const result: any = Object.values(groupedByMonth);
      setMonthlyStats(prevStats => ({
        ...prevStats,
        BP: result
      }));
    });
  }

  function getCO() {
    axios.get('18kaPQlN0_kA9i7YAD-DftbdVPZX35Qf33sVMkw_TcWc/values/BPCO UR Input', {
      headers: {
        Authorization: `Token ${import.meta.env.VITE_TOKEN}`,
      }
    }).then((response) => {
      const data = response.data.values;
      const records = data.slice(3);
      
      const groupedByMonth = records.reduce((acc: any, row: any) => {
        const period = row[1];
        
        const lguDetails = {
          id: row[0],
          lguName: row[4],
          status: row[5],
          progressRate: row[6],
          concerns: row[7],
          actionItems: row[8],
          otherRemarks: row[9],
          universalStatus: row[10],
          mpar: row[11],
          geocode: row[12],
          name: row[13],
          province: row[14],
          region: row[15],
          district: row[16],
          level: row[16],
          incomeClass: row[17],
          dictRo: row[18]
        };
  
        if (!acc[period]) {
          acc[period] = {
            date: period,
            values: []
          };
        }
  
        acc[period].values.push(lguDetails);
        return acc;
      }, {});
  
      const result: any = Object.values(groupedByMonth);
      setMonthlyStats(prevStats => ({
        ...prevStats,
        CO: result
      }));
    });
  }
 
  function getWP() {
    axios.get('18kaPQlN0_kA9i7YAD-DftbdVPZX35Qf33sVMkw_TcWc/values/WP UR Input', {
      headers: {
        Authorization: `Token ${import.meta.env.VITE_TOKEN}`,
      }
    }).then((response) => {
      const data = response.data.values;
      const records = data.slice(3);
      
      const groupedByMonth = records.reduce((acc: any, row: any) => {
        const period = row[1];
        
        const lguDetails = {
          id: row[0],
          lguName: row[4],
          status: row[5],
          progressRate: row[6],
          concerns: row[7],
          actionItems: row[8],
          otherRemarks: row[9],
          universalStatus: row[10],
          mpar: row[11],
          geocode: row[12],
          name: row[13],
          province: row[14],
          region: row[15],
          district: row[16],
          level: row[16],
          incomeClass: row[17],
          dictRo: row[18]
        };
  
        if (!acc[period]) {
          acc[period] = {
            date: period,
            values: []
          };
        }
  
        acc[period].values.push(lguDetails);
        return acc;
      }, {});
  
      const result: any = Object.values(groupedByMonth);
      setMonthlyStats(prevStats => ({
        ...prevStats,
        WP: result
      }));
    });
  }

  function getBC() {
    axios.get('18kaPQlN0_kA9i7YAD-DftbdVPZX35Qf33sVMkw_TcWc/values/BC UR Input', {
      headers: {
        Authorization: `Token ${import.meta.env.VITE_TOKEN}`,
      }
    }).then((response) => {
      const data = response.data.values;
      const records = data.slice(3);
      
      const groupedByMonth = records.reduce((acc: any, row: any) => {
        const period = row[1];
        
        const lguDetails = {
          id: row[0],
          lguName: row[4],
          status: row[5],
          progressRate: row[6],
          concerns: row[7],
          actionItems: row[8],
          otherRemarks: row[9],
          universalStatus: row[10],
          mpar: row[11],
          geocode: row[12],
          name: row[13],
          province: row[14],
          region: row[15],
          district: row[16],
          level: row[16],
          incomeClass: row[17],
          dictRo: row[18]
        };
  
        if (!acc[period]) {
          acc[period] = {
            date: period,
            values: []
          };
        }
  
        acc[period].values.push(lguDetails);
        return acc;
      }, {});
  
      const result: any = Object.values(groupedByMonth);
      setMonthlyStats(prevStats => ({
        ...prevStats,
        BC: result
      }));
    });
  }

  useEffect(() => {
    setMonthlyStats({});
    
    if (services.includes('Building Permit')) {
      getBP();
    }
    if (services.includes('Certificate of Occupancy')) {
      getCO();
    }
    if (services.includes('Working Permit')) {
      getWP();
    }
    if (services.includes('Barangay Clearance')) {
      getBC();
    }
  
    console.log('Selected services:', services);
  }, [services]);

  const [activeItem, setActiveItem] = useState(() => {
    const savedItem = localStorage.getItem('activeMenuItem');
    if (savedItem) return savedItem;
    
    const currentPath = location.pathname;
    const matchingItem = menuItems.find(item => currentPath.includes(item.path.split('/').pop() || ''));
    return matchingItem ? matchingItem.name : "Reports";
  });

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingItem = menuItems.find(item => currentPath.includes(item.path.split('/').pop() || ''));
    if (matchingItem) {
      setActiveItem(matchingItem.name);
      localStorage.setItem('activeMenuItem', matchingItem.name);
    }
  }, [location.pathname]);

  const handleMenuClick = (item: string, path: string) => {
    setActiveItem(item);
    localStorage.setItem('activeMenuItem', item);
    navigate(path);
  };

  const [showScroll, _setShowScroll] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen w-full flex">
        <nav className="fixed top-0 left-0 w-[20vw] lg:hidden h-screen bg-[#0136a8] z-[99999] flex flex-col items-start p-5">
          <Link className="flex w-full mr-5 gap-2" to="/central/">
            <img src={viteLogo} className="logo h-20 object-contain self-center" alt="DICT logo" />
          </Link>
          <h1 className="text-white font-gmedium text-xl mt-10">DATA DASHBOARD</h1>
          <div className="text-white flex gap-1 font-gmedium mt-4">
            <ListFilter/> Filter
          </div>
          <LGUServiceDropdown/>
          <DataPresentationOptions/>
        </nav>
        <div className="min-h-[100vh] w-full z-10 flex flex-col items-center">
          <div className="w-[90%] flex flex-col gap-10 min-h-[10px] ">
            {/* Menu Button */}
            <div className="hidden md:grid-cols-2 w-full items-start z-[50] justify-center md:flex px-5 md:mt-5 min-h-[70px] rounded-sm md:flex-col md:gap-3 ">
                <button
                  className={`text-accent bg-[#0136a8] p-2 absolute  rounded-md shadow-md ${
                    isMenuOpen ? "hidden" : ""
            }`}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <MenuIcon />
                </button>

                <div className="flex gap-2 items-center md:ml-28 md:fixed lg:hidden">
                  <div className="font-gsemibold md:text-xs">Welcome, (Regor)</div>
                  <img className="rounded-full w-10 h-10 md:mr-5" src={Profile} alt="" />
                </div>

              </div>

                {/* Sidebar Navigation - Visible when menu is open */}
                {isMenuOpen && (
                  <nav className="fixed top-0 md:overflow-auto md:h-full left-0 md:w-64 h-screen bg-[#0136a8] z-[99999] flex flex-col items-start p-5">
                    {/* Close Button */}
                    <button
                      className="absolute top-4 left-52 text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <X className='bg-red-600 rounded-sm' size={32}/>
                    </button>

                    <Link className="flex w-full mr-5 gap-2" to="/central/">
                      <img
                        src={viteLogo}
                        className="logo h-20 object-contain self-center"
                        alt="DICT logo"
                      />
                    </Link>

                    <h1 className="text-white font-gmedium text-xl mt-10">
                      DATA DASHBOARD
                    </h1>

                    <div className="text-white flex gap-1 font-gmedium mt-4">
                      <ListFilter /> Filter
                    </div>

                    <LGUServiceDropdown />
                    <DataPresentationOptions />
                  </nav>
                )}

              {isMenuOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-30 md:transition-opacity md:duration-300 md:ease-in-out"
                  onClick={() => setIsMenuOpen(false)}
                ></div>
              )}


              <div className="flex-1 ml-[20vw] lg:ml-0 ">
              <header className="md:fixed md:mt-24 sticky top-0 z-20 bg-white/20 backdrop-blur-md h-[100px] w-full px-20 md:px-5 flex items-center justify-between text-[#6B6B6B]">
                <ul className="flex gap-10 md:text-base md:gap-5">
                  {menuItems.map((item) => (
                    <li
                      key={item.name}
                      onClick={() => handleMenuClick(item.name, item.path)}
                      className={`border border-t-0 border-r-0 border-l-0 cursor-pointer ${
                        activeItem === item.name
                          ? "border-b-2 border-[#0136a8] font-gsemibold text-[#0136a8]"
                          : "border-b-0 hover:border-b-2 hover:border-[#0136a8] hover:font-gsemibold hover:text-[#0136a8]"
                      }`}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 items-center lg:hidden ">
                  <img className="rounded-full w-10 h-10 " src={Profile} alt="" />
                  <div className="font-gsemibold ">Welcome, (Regor)</div>
                </div>
              </header>



              <main className="w-full">
                <Outlet />
              </main>

              {/* Scroll to Top Button */}
              {showScroll && (
                  <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 p-3 bg-[#0136a8] text-white rounded-full shadow-lg hover:bg-blue-700 transition"
                  >
                    <ChevronUp size={24} />
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;