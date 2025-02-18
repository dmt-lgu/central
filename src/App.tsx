import { ThemeProvider } from "@/components/theme-provider"
import { useState, useEffect } from "react"
import viteLogo from "/DICT.png"
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"
import { ChevronUp, ListFilter, MenuIcon, X } from "lucide-react"
import LGUServiceDropdown from "./screens/centralOffice/testing/ServicesList"
import DataPresentationOptions from "./screens/centralOffice/testing/DataPresentationOptions"
import Profile from "./assets/Layer_1@2x.png"
import APIs from "./screens/index.json"
import axios from "./plugin/axios"
import { useSelector} from 'react-redux';
import {selectRegions } from './redux/regionSlice';

interface RegionData {
  region: string;
  operational: number;
  DEVELOPMENTAL: number;
  TRAINING: number;
  WITHDRAW: number;
}

interface MonthlyData {
  date: string;
  data: RegionData[];
}

function App() {

  const regionss = useSelector(selectRegions);
  const location = useLocation();
  const navigate = useNavigate();
  const [showScroll, setShowScroll] = useState(false);
  
  const menuItems = [
    { name: "Reports", path: "/central/reports" },
    { name: "Utilization Status", path: "/central/utilization" },
    { name: "LGU", path: "/central/lgu" },
  ];
  
  
  const [monthlyStats, setMonthlyStats] = useState<MonthlyData[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  function getMonthlyStats() {
    axios.get('18kaPQlN0_kA9i7YAD-DftbdVPZX35Qf33sVMkw_TcWc/values/BP1 UR Input', {
      headers: {
        Authorization: `Token ${import.meta.env.VITE_TOKEN}`,
      }
    }).then((response) => {
      const data = response.data.values;
      // Skip first 3 rows as they are headers
      const records = data.slice(3);
      
      // Group by period (YYYY-MM)
      const groupedByMonth = records.reduce((acc: any, row: any) => {
        const period = row[1]; // period is in column index 1 (2024-01)
        
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
  
      // Convert to array format
      const result:any = Object.values(groupedByMonth);
      setMonthlyStats(result);
      
      console.log(result);
    });
  }
  useEffect(() => {
    getMonthlyStats();

    const handleScroll = () => {
      setShowScroll(window.scrollY > 200); // Show button after 200px of scrolling
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Initialize activeItem from localStorage or based on current path
  const [activeItem, setActiveItem] = useState(() => {
    const savedItem = localStorage.getItem('activeMenuItem');
    if (savedItem) return savedItem;
    
    // If no saved item, determine from current path
    const currentPath = location.pathname;
    const matchingItem = menuItems.find(item => currentPath.includes(item.path.split('/').pop() || ''));
    return matchingItem ? matchingItem.name : "Reports";
  });

  // Update activeItem when location changes
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

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen w-full flex">
        <nav className="fixed top-0 left-0 w-[20vw] md:hidden h-screen bg-[#0136a8] z-[99999] flex flex-col items-start p-5">
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
            <div className="hidden md:grid-cols-2 w-full items-start z-[4] justify-center md:flex px-5 md:mt-5 min-h-[70px] rounded-sm md:flex-col md:gap-3">
                <button
                  className={`text-accent bg-[#0136a8] p-2 md:fixed z-500 rounded-md shadow-md ${
                    isMenuOpen ? "hidden" : ""
            }`}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <MenuIcon />
                </button>

                <div className="flex gap-2 items-center md:ml-28 md:fixed md:hidden">
                  <div className="font-gsemibold md:text-xs">Welcome, (Ryan Gwapo)</div>
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


              <div className="flex-1 ml-[20vw] md:ml-0 ">
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
                <div className="flex gap-2 items-center md:hidden ">
                  <img className="rounded-full w-10 h-10 " src={Profile} alt="" />
                  <div className="font-gsemibold ">Welcome, (Nico Gwapo)</div>
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