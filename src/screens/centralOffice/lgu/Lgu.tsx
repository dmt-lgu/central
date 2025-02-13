import axios from "./../../../plugin/axios";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { debounce, set } from "lodash";
import { selectProject } from "@/redux/projectSlice";
import { useSelector } from "react-redux";

interface LGU {
  geocode: string;
  lguFullName: string;
  province: string;
  region: string;
  district: string;
  level: string;
  incomeClass: string;
  monthlyStatus: string;
}

interface LGUData {
  lguFullName: string;
  monthlyStatus: Record<string, string>;
  progressRate: string;
  concerns: string;
  actionItems: string;
  otherRemarks: string;
  universalStatus: string;
  mpar: string;
  geocode: string;
  cm: string;
  province: string;
  region: string;
  district: string;
  level: string;
  incomeClass: string;
  dictRo: string;
  sort: string;
}

const LGU: React.FC = () => {
  const [lguList, setLguList] = useState<LGUData[]>([]);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedLGU, setSelectedLGU] = useState<LGU | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [statusMap, setStatusMap] = useState<Map<string, Record<string, string>>>(new Map());
  const services = useSelector(selectProject);

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 700),
    []
  );

  useEffect(() => {

    if (search === "") {
      setSelectedLGU(null);
      setDebouncedSearch("");
    } else {
      debouncedSetSearch(search);
    }
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [search, debouncedSetSearch]);



  const filteredLGUs = useMemo(
    () =>
      lguList.filter(
        (lgu) =>
          lgu.lguFullName?.toLowerCase().includes(debouncedSearch?.toLowerCase())
      ),
    [debouncedSearch, lguList]
  );

  function transformLGUData(rawData: string[][], serviceType: string) {
    const allLGUs = rawData.slice(3).map(row => {
      const geocode = row[12] || '';
      const status = row[10]?.slice(4) || '';
      
      // Update status map
      const currentStatuses = statusMap.get(geocode) || {};
      statusMap.set(geocode, {
        ...currentStatuses,
        [serviceType]: status
      });

      // Create combined status string
      const combinedStatus = Object.entries(statusMap.get(geocode) || {})
        .map(([service, status]) => `${service}: ${status}`)
        .join(' | ');

      return {
        lguFullName: row[4] || '',
        monthlyStatus: { [serviceType]: status },
        progressRate: row[6] || '',
        concerns: row[7] || '',
        actionItems: row[8] || '',
        otherRemarks: row[9] || '',
        universalStatus: row[10] || '',
        mpar: row[11] || '',
        geocode,
        cm: row[13] || '',
        province: row[14] || '',
        region: row[15] || '',
        district: row[16] || '',
        level: row[17] || '',
        incomeClass: row[18] || '',
        dictRo: row[19] || '',
        sort: row[20] || ''
      };
    });

    // Create a Map to store unique LGUs using geocode as the key
    const uniqueLGUs = new Map();
    
    allLGUs.forEach(lgu => {
      if (!uniqueLGUs.has(lgu.geocode)) {
        uniqueLGUs.set(lgu.geocode, {
          ...lgu,
          monthlyStatus: statusMap.get(lgu.geocode) || {}
        });
      }
    });

    return Array.from(uniqueLGUs.values());
  }

  const formatMonthlyStatus = (statuses: Record<string, string>) => {
    return Object.entries(statuses)
      .map(([service, status]) => `${service}: ${status}`)
      .join(' | ');
  };

  function GetBP() {
    axios.get('18kaPQlN0_kA9i7YAD-DftbdVPZX35Qf33sVMkw_TcWc/values/BP1 UR Input', {
      headers: {
        Authorization: `Token ${import.meta.env.VITE_TOKEN}`,
      },
    }).then((response) => {
      const rawData = response.data.values;
      const transformedData = transformLGUData(rawData, 'BP');
      setLguList(prevList => {
        const newList = [...prevList];
        transformedData.forEach(lgu => {
          const existingIndex = newList.findIndex(existing => existing.geocode === lgu.geocode);
          if (existingIndex === -1) {
            newList.push(lgu);
          } else {
            newList[existingIndex] = {
              ...newList[existingIndex],
              monthlyStatus: {
                ...newList[existingIndex].monthlyStatus,
                ...lgu.monthlyStatus
              }
            };
          }
        });
        return newList;
      });
    }).catch(error => {
      console.error('Error fetching BP data:', error);
    });
  }

  function GetBC() {
    axios.get('18kaPQlN0_kA9i7YAD-DftbdVPZX35Qf33sVMkw_TcWc/values/BC UR Input', {
      headers: {
        Authorization: `Token ${import.meta.env.VITE_TOKEN}`,
      },
    }).then((response) => {
      const rawData = response.data.values;
      const transformedData = transformLGUData(rawData, 'BC');
      setLguList(prevList => {
        const newList = [...prevList];
        transformedData.forEach(lgu => {
          const existingIndex = newList.findIndex(existing => existing.geocode === lgu.geocode);
          if (existingIndex === -1) {
            newList.push(lgu);
          } else {
            newList[existingIndex] = {
              ...newList[existingIndex],
              monthlyStatus: {
                ...newList[existingIndex].monthlyStatus,
                ...lgu.monthlyStatus
              }
            };
          }
        });
        return newList;
      });
    }).catch(error => {
      console.error('Error fetching BC data:', error);
    });
  }
  function GetWP() {
    axios.get('18kaPQlN0_kA9i7YAD-DftbdVPZX35Qf33sVMkw_TcWc/values/WP UR Input', {
      headers: {
        Authorization: `Token ${import.meta.env.VITE_TOKEN}`,
      },
    }).then((response) => {
      const rawData = response.data.values;
      const transformedData = transformLGUData(rawData, 'WP');
      setLguList(prevList => {
        const newList = [...prevList];
        transformedData.forEach(lgu => {
          const existingIndex = newList.findIndex(existing => existing.geocode === lgu.geocode);
          if (existingIndex === -1) {
            newList.push(lgu);
          } else {
            newList[existingIndex] = {
              ...newList[existingIndex],
              monthlyStatus: {
                ...newList[existingIndex].monthlyStatus,
                ...lgu.monthlyStatus
              }
            };
          }
        });
        return newList;
      });
    }).catch(error => {
      console.error('Error fetching WP data:', error);
    });
  }
  function GetCO() {
    axios.get('18kaPQlN0_kA9i7YAD-DftbdVPZX35Qf33sVMkw_TcWc/values/BPCO UR Input', {
      headers: {
        Authorization: `Token ${import.meta.env.VITE_TOKEN}`,
      },
    }).then((response) => {
      const rawData = response.data.values;
      const transformedData = transformLGUData(rawData, 'CO');
      setLguList(prevList => {
        const newList = [...prevList];
        transformedData.forEach(lgu => {
          const existingIndex = newList.findIndex(existing => existing.geocode === lgu.geocode);
          if (existingIndex === -1) {
            newList.push(lgu);
          } else {
            newList[existingIndex] = {
              ...newList[existingIndex],
              monthlyStatus: {
                ...newList[existingIndex].monthlyStatus,
                ...lgu.monthlyStatus
              }
            };
          }
        });
        return newList;
      });
    }).catch(error => {
      console.error('Error fetching CO data:', error);
    });
  }

  useEffect(() => {
    setLguList([]);
    setSelectedLGU(selectedLGU); // Reset selectedLGU when services change
    if (services.includes("Working Permit")) {
      GetWP();
    }
    if (services.includes("Building Permit")) {
      GetBP();
    }
    if (services.includes("Certificate of Occupancy")) {
      GetCO();
    }
    if (services.includes("Barangay Clearance")) {
      GetBC();
    }
    
  }, [services]);

  useEffect(() => {
    if (selectedLGU && lguList.length > 0) {
      const updatedLgu = lguList.find(lgu => lgu.geocode === selectedLGU.geocode);
      if (updatedLgu) {
        setSelectedLGU({
          geocode: updatedLgu.geocode,
          lguFullName: updatedLgu.lguFullName,
          province: updatedLgu.province,
          region: updatedLgu.region,
          district: updatedLgu.district,
          level: updatedLgu.level,
          incomeClass: updatedLgu.incomeClass,
          monthlyStatus: formatMonthlyStatus(updatedLgu.monthlyStatus)
        });
      }
    }
  }, [lguList]);

  const handleSelect = (lgu: LGUData) => {
    setSearch(lgu.lguFullName);
    setSelectedLGU({
      geocode: lgu.geocode,
      lguFullName: lgu.lguFullName,
      province: lgu.province,
      region: lgu.region,
      district: lgu.district,
      level: lgu.level,
      incomeClass: lgu.incomeClass,
      monthlyStatus: formatMonthlyStatus(lgu.monthlyStatus)
    });
    setShowSuggestions(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    if (search && filteredLGUs.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="w-full h-full px-5 flex flex-col items-center gap-10">
      <div className="bg-[#EBEFF5] border border-border flex flex-col px-10 py-4 rounded w-[80%] relative">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="search" className="block text-[#6B6B6B] font-gmedium">
            LGU
          </label>
          <div className="relative">
            <input
              type="search"
              id="search"
              className="w-full p-2 border outline-[#6B6B6B] text-[#6B6B6B] font-gregular pl-4 rounded-sm"
              placeholder="Search LGU"
              value={search}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
            />
            {showSuggestions && search && filteredLGUs.length > 0 && (
              <ul className="absolute bg-white border rounded mt-2 shadow w-full z-10 max-h-60 overflow-y-auto">
                {filteredLGUs.map((lgu) => (
                  <li
                    key={lgu.geocode}
                    className="p-2 hover:bg-gray-200 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleSelect(lgu)}
                  >
                    {lgu.lguFullName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 w-[60%] self-center flex rounded-md bg-white border border-border">
        <table className="w-full text-left rounded-2xl overflow-hidden border border-border">
          <tbody>
            <tr>
              <th className="py-2 w-[40%] px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Geocode</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.geocode || "-"}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Name</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.lguFullName || "-"}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Province</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.province || "-"}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Region</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.region || "-"}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">District</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.district || "-"}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Level</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.level || "-"}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Income Class</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.incomeClass || "-"}</td>
            </tr>
            <tr>
              <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Utilization Status</th>
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.monthlyStatus|| "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LGU;