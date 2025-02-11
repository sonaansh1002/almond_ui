import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from "js-cookie";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        return JSON.parse(token);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }
  return null;
}


export function getRole(): string | null {
  if (typeof window !== 'undefined') {
    const role = localStorage.getItem('role');
    if (role) {
      try {
        return JSON.parse(role);
      } catch (error) {
        console.error('Error parsing userType:', error);
      }
    }
  }
  return null;
}

export function getVendorId(): string | null {
  if (typeof window !== 'undefined') {
    const vendor_id = localStorage.getItem('vendor_id');
    if (vendor_id) {
      try {
        return JSON.parse(vendor_id);
      } catch (error) {
        console.error('Error parsing userType:', error);
      }
    }
  }
  return null;
}


export function removeToken(): string | null {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('data');
    localStorage.removeItem('role');

    Cookies.remove('accessToken')
    Cookies.remove('data');
    Cookies.remove('role');

  }
  return null;
}


export function getDateAndTimeInIST(createdAtStr: string): {
  date: string;
  time: string;
} {
  const dateObj = new Date(createdAtStr);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };


  const dateTimeInIST: string = dateObj.toLocaleString('en-US', options);
  const [date, time] = dateTimeInIST.split(', ');

  return {
    date: date,
    time: time,
  };
}


export function getDateAndTime(createdAtStr: string): {
  date: string;
  time: string;
} {
  const [date, timeWithMs] = createdAtStr.split('T');

  // Splitting the date into year, month, and day
  const [year, month, day] = date.split('-');

  // Rearranging to dd/mm/yy format
  // const formattedDate = `${day}-${month}-${year.slice(2)}`;
  const formattedDate = `${day}-${month}-${year}`;


  const [hours, minutes] = timeWithMs.split(':');
  let hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  const time = `${hour}:${minutes} ${ampm}`;

  return {
    date: formattedDate,
    time: time,
  };
}
// utils.js (or wherever you define your utility functions)
export function exportExcel(blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Product-List.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// textFormatter.js
export function convertText(inputText: string): string {
  const [mainPart] = inputText.split('-');
  const formattedMain = mainPart
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return `${formattedMain}`;
}


// export function getUserId() : string | null {

//   if (typeof window !== 'undefined') {
//     const data = localStorage.getItem('data');
//     if (data) {
//       try {
//         const parsedData = JSON.parse(data); // Parse the JSON string
//         return parsedData.payload?.user_id || null; // Return the user_id if it exists
//       } catch (error) {
//         console.error('Error parsing userType:', error);
//       }
//     }
//   }
// }
export function getUserId(): string | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('data');
    if (data) {
      try {
        const parsedData = JSON.parse(data); // Parse the JSON string
        return parsedData?.payload?.user_id || null; // Return user_id if it exists, otherwise null
      } catch (error) {
        console.error('Error parsing data:', error);
        return null; // Return null if there's a parsing error
      }
    }
  }
  return null; // Return null if window is undefined or data is not found
}



// if (typeof window !== 'undefined') {
//   const data = localStorage.getItem('data');
//   if (data) {
//     try {
//       const parsedData = JSON.parse(data); // Parse the JSON string
//       return parsedData.payload?.user_id || null; // Return the user_id if it exists
//     } catch (error) {
//       console.error('Error parsing data from localStorage:', error);
//       return null;
//     }
//   } else {
//     console.error('No data found in localStorage');
//     return null;
//   }
// }
