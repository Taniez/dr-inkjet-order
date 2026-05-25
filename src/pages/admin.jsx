import { useState } from "react";

export default function Admin() {

  // =========================
  // LOGIN
  // =========================

  const [password, setPassword] =
    useState("");

  const [loggedIn, setLoggedIn] =
    useState(false);

  // =========================
  // DATA
  // =========================

  const [history, setHistory] =
    useState([]);

  const [search, setSearch] =
    useState("");

  // =========================
  // FORM STATES
  // =========================

  const [customer, setCustomer] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [taxId, setTaxId] =
    useState("");

  const [note, setNote] =
    useState("");

  const [payment, setPayment] =
    useState("โอน");

  const [items, setItems] =
    useState([
      {
        name: "",
        size: "",
        qty: "",
        price: "",
        suggestions: [],
      },
    ]);

  // =========================
  // SEARCH FILTER
  // =========================

  const filteredHistory =
    history.filter((item) => {

      const keyword =
        search.toLowerCase();

      return (

        item.customer
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.name
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.phone
          ?.toString()
          .includes(keyword)

        ||

        item.note
          ?.toLowerCase()
          .includes(keyword)

      );

    });

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
  // FETCH DATA
  // =========================

  const fetchHistory = () => {

    const oldScript =
      document.getElementById(
        "sheetScript"
      );

    if (oldScript) {

      oldScript.remove();
    }

    delete window.loadData;

    window.loadData = (data) => {

      console.log(data);

      setHistory(data || []);
    };

    const script =
      document.createElement("script");

    script.id = "sheetScript";

    script.src =
      `https://script.google.com/macros/s/AKfycbzrbp4x9IxNQkO4RAnGi1TuzvdYZLPDpQ-q1pFebTpsGkp7CraUw9zqSk9xCItC-zs/exec?callback=loadData&t=${Date.now()}`;

    document.body.appendChild(script);
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

        {/* HEADER */}

        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center mb-6">

          <div className="text-2xl md:text-3xl font-bold">
            ประวัติรายการทั้งหมด
          </div>

          <button
            onClick={fetchHistory}
            className="bg-blue-500 text-white px-5 py-3 rounded-xl"
          >
            รีโหลด
          </button>

        </div>

        {/* SEARCH */}

        <div className="mb-6">

          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้า / รายการ / เบอร์โทร"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border p-4 rounded-2xl"
          />

        </div>

        {/* TABLE */}

        <div className="overflow-auto rounded-2xl border">

          <table className="w-full text-sm min-w-[1200px]">

            <thead className="bg-black text-white">

              <tr>

                <th className="p-3 text-left">
                  วันที่
                </th>

                <th className="p-3 text-left">
                  รายการ
                </th>

                <th className="p-3 text-left">
                  ขนาด
                </th>

                <th className="p-3 text-center">
                  จำนวน
                </th>

                <th className="p-3 text-center">
                  ราคา
                </th>

                <th className="p-3 text-center">
                  รวม
                </th>

                <th className="p-3 text-left">
                  การชำระเงิน
                </th>

                <th className="p-3 text-left">
                  ลูกค้า
                </th>

                <th className="p-3 text-left">
                  เบอร์โทร
                </th>

                <th className="p-3 text-left">
                  เลขผู้เสียภาษี
                </th>

                <th className="p-3 text-left">
                  หมายเหตุ
                </th>

                <th className="p-3 text-left">
                  แก้ไข
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredHistory.length > 0 ? (

                filteredHistory.map((item, index) => (

                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-3">

                      {
                        item.date
                          ? new Date(item.date)
                              .toLocaleDateString(
                                "th-TH"
                              )
                          : ""
                      }

                    </td>

                    <td className="p-3">
                      {item.name}
                    </td>

                    <td className="p-3">
                      {item.size}
                    </td>

                    <td className="p-3 text-center">
                      {item.qty}
                    </td>

                    <td className="p-3 text-center">
                      {item.price}
                    </td>

                    <td className="p-3 text-center font-bold">
                      {item.total}
                    </td>

                    <td className="p-3">
                      {item.payment}
                    </td>

                    <td className="p-3">
                      {item.customer}
                    </td>

                    <td className="p-3">
                      {item.phone}
                    </td>

                    <td className="p-3">
                      {item.tax}
                    </td>

                    <td className="p-3">
                      {item.note}
                    </td>

                    {/* EDIT */}

                    <td className="p-3">

                      <button

                        onClick={() => {

                          setCustomer(
                            item.customer || ""
                          );

                          setPhone(
                            item.phone || ""
                          );

                          setTaxId(
                            item.tax || ""
                          );

                          setNote(
                            item.note || ""
                          );

                          setPayment(
                            item.payment || "โอน"
                          );

                          setItems([
                            {
                              name:
                                item.name || "",

                              size:
                                item.size || "",

                              qty:
                                item.qty || "",

                              price:
                                item.price || "",

                              suggestions: [],
                            },
                          ]);

                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });

                        }}

                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl"

                      >
                        แก้ไข
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="12"
                    className="text-center p-10 text-gray-500"
                  >
                    ไม่มีข้อมูล
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}