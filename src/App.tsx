import { ThemeProvider } from "@/components/theme-provider"
import { useState, useEffect } from "react";
import viteLogo from "/DICT.png";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ListFilter } from "lucide-react";
import LGUServiceDropdown from "./screens/centralOffice/testing/ServicesList";
import DataPresentationOptions from "./screens/centralOffice/testing/DataPresentationOptions";
import Profile from "./assets/Layer_1@2x.png";
import APIs from "./screens/index.json"
import axios from "./plugin/axios";
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
  
  const menuItems = [
    { name: "Reports", path: "/central/reports" },
    { name: "Utilization Status", path: "/central/utilization" },
    { name: "LGU", path: "/central/lgu" }
  ];

  const [monthlyStats, setMonthlyStats] = useState<MonthlyData[]>([]);

 
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
  }, []);

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

        <div className="flex-1 ml-[20vw] md:ml-0">
          <header className="sticky top-0 z-50 md:hidden bg-white/20 backdrop-blur-md h-[100px] w-full px-20 flex items-center justify-between text-[#6B6B6B]">
            <ul className="flex gap-10">
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

            <div className="flex gap-2 items-center">
              <img className="rounded-full w-10 h-10" src={Profile} alt="" />
              <div className="font-gsemibold">Welcome, (Nico Gwapo)</div>
            </div>
          </header>

          <main className="w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;