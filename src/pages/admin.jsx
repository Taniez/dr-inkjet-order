import { useEffect, useState } from "react";

export default function Admin() {

  const [password, setPassword] =
    useState("");

  const [loggedIn, setLoggedIn] =
    useState(false);

  const [history, setHistory] =
    useState([]);

  // =========================
  // LOGIN
  // =========================

  const login = () => {

    if (password === "1108") {

      setLoggedIn(true);

      fetchHistory();

    } else {

      alert("รหัสไม่ถูกต้อง");
    }
  };

  // =========================
  // FETCH SHEET
  // =========================

  const fetchHistory = async () => {

    try {

      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbxj98tbgrbLoyk4hwkeas0WJs6Qq0e426pAzkmnnF4Ac7DUKLrwpwhFijgUSPhjApQ/exec"
      );

      const data = await res.json();

      setHistory(data);

    } catch (err) {

      console.log(err);

      alert("โหลดข้อมูลไม่สำเร็จ");
    }
  };

  // =========================
  // LOGIN PAGE
  // =========================

  if (!loggedIn) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">

        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">

          <div className="text-3xl font-bold text-center mb-6">
            ADMIN LOGIN
          </div>

          <input
            type="password"
            placeholder="กรอกรหัสผ่าน"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          />

          <button
            onClick={login}
            className="w-full mt-4 bg-purple-700 text-white p-4 rounded-xl"
          >
            เข้าสู่ระบบ
          </button>

        </div>

      </div>

    );
  }

  // =========================
  // ADMIN PAGE
  // =========================

  return (

    <div className="min-h-screen bg-gray-100 p-5">

      <div className="bg-white rounded-3xl shadow-xl p-6">

        <div className="flex justify-between items-center mb-6">

          <div className="text-3xl font-bold">
            ประวัติรายการทั้งหมด
          </div>

          <button
            onClick={fetchHistory}
            className="bg-blue-500 text-white px-5 py-3 rounded-xl"
          >
            รีโหลด
          </button>

        </div>

        <div className="overflow-auto">

          <table className="w-full border text-sm">

            <thead className="bg-black text-white">

              <tr>

                <th className="p-3">
                  วันที่
                </th>

                <th className="p-3">
                  รายการ
                </th>

                <th className="p-3">
                  ขนาด
                </th>

                <th className="p-3">
                  จำนวน
                </th>

                <th className="p-3">
                  ราคา
                </th>

                <th className="p-3">
                  รวม
                </th>

                <th className="p-3">
                  ลูกค้า
                </th>

              </tr>

            </thead>

            <tbody>

              {history.map((item, index) => (

                <tr
                  key={index}
                  className="border-t"
                >

                  <td className="p-3">
                    {item.date}
                  </td>

                  <td className="p-3">
                    {item.name}
                  </td>

                  <td className="p-3">
                    {item.size}
                  </td>

                  <td className="p-3">
                    {item.qty}
                  </td>

                  <td className="p-3">
                    {item.price}
                  </td>

                  <td className="p-3">
                    {item.total}
                  </td>

                  <td className="p-3">
                    {item.customer}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}