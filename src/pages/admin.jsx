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
  // POPUP
  // =========================

  const [editOpen, setEditOpen] =
    useState(false);

  const [editRow, setEditRow] =
    useState(null);

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
      `https://script.google.com/macros/s/AKfycbwcSCCZk4jydztXeT_1LEwKnpSgrlc5waH8UZkvJWbJGqr-1ftNM4GVJrl6-HG7OlYl/exec?callback=loadData&t=${Date.now()}`;

    document.body.appendChild(script);
  };

  // =========================
  // UPDATE
  // =========================

  const updateData = async () => {

    const item = items[0];
  
    await fetch(
      "https://script.google.com/macros/s/AKfycbwcSCCZk4jydztXeT_1LEwKnpSgrlc5waH8UZkvJWbJGqr-1ftNM4GVJrl6-HG7OlYl/exec",
      {
  
        method: "POST",
  
        mode: "no-cors",
  
        headers: {
          "Content-Type":
            "text/plain;charset=utf-8",
        },
  
        body: JSON.stringify({
  
          action: "update",
  
          row: editRow,
  
          date:
            new Date()
              .toLocaleDateString(),
  
          name: item.name,
  
          size: item.size,
  
          qty: item.qty,
  
          price: item.price,
  
          payment,
  
          customer,
  
          phone,
  
          tax: taxId,
  
          note,
  
        }),
  
      }
    );
  
    alert("แก้ไขสำเร็จ");
  
    setEditOpen(false);
  
    fetchHistory();
  };

  // =========================
  // DELETE
  // =========================

  const deleteData =
  async (row) => {

    const confirmDelete =
      confirm("ลบรายการนี้?");

    if (!confirmDelete)
      return;

    await fetch(
      "https://script.google.com/macros/s/AKfycbwcSCCZk4jydztXeT_1LEwKnpSgrlc5waH8UZkvJWbJGqr-1ftNM4GVJrl6-HG7OlYl/exec",
      {

        method: "POST",

        mode: "no-cors",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8",
        },

        body: JSON.stringify({

          action: "delete",

          row,

        }),

      }
    );

    alert("ลบสำเร็จ");

    fetchHistory();
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
                  จัดการ
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

                    <td className="p-3 flex gap-2">

                      {/* EDIT */}

                      <button

                        onClick={() => {

                          setEditRow(
                            item.row
                          );

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

                          setEditOpen(true);

                        }}

                        className="
                          bg-yellow-400
                          hover:bg-yellow-500
                          text-black
                          px-4
                          py-2
                          rounded-xl
                        "

                      >
                        แก้ไข
                      </button>

                      {/* DELETE */}

                      <button

                        onClick={() =>
                          deleteData(
                            item.row
                          )
                        }

                        className="
                          bg-red-500
                          hover:bg-red-600
                          text-white
                          px-4
                          py-2
                          rounded-xl
                        "

                      >
                        ลบ
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

      {/* POPUP */}

      {editOpen && (

        <div className="
          fixed
          inset-0
          bg-black/50
          z-50
          flex
          items-center
          justify-center
          p-5
        ">

          <div className="
            bg-white
            rounded-3xl
            w-full
            max-w-2xl
            p-6
          ">

            <div className="
              flex
              justify-between
              items-center
              mb-6
            ">

              <div className="
                text-2xl
                font-bold
              ">
                แก้ไขข้อมูล
              </div>

              <button
                onClick={() =>
                  setEditOpen(false)
                }
                className="text-3xl"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <div className="space-y-4">

              <input
                type="text"
                placeholder="ชื่อลูกค้า"
                value={customer}
                onChange={(e) =>
                  setCustomer(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  p-4
                  rounded-xl
                "
              />

              <input
                type="text"
                placeholder="เบอร์โทร"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  p-4
                  rounded-xl
                "
              />

              <input
                type="text"
                placeholder="เลขผู้เสียภาษี"
                value={taxId}
                onChange={(e) =>
                  setTaxId(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  p-4
                  rounded-xl
                "
              />

              <textarea
                placeholder="หมายเหตุ"
                value={note}
                onChange={(e) =>
                  setNote(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  p-4
                  rounded-xl
                "
              />

              <select
                value={payment}
                onChange={(e) =>
                  setPayment(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  p-4
                  rounded-xl
                "
              >

                <option value="โอน">
                  โอน
                </option>

                <option value="เงินสด">
                  เงินสด
                </option>

                <option value="ค้างจ่าย">
                  ค้างจ่าย
                </option>

              </select>

            </div>

            {/* ITEM */}

            <div className="mt-6">

              {items.map((item, index) => (

                <div
                  key={index}
                  className="
                    border
                    rounded-2xl
                    p-4
                  "
                >

                  <input
                    type="text"
                    placeholder="รายการ"
                    value={item.name}
                    onChange={(e) => {

                      const newItems =
                        [...items];

                      newItems[index].name =
                        e.target.value;

                      setItems(newItems);

                    }}
                    className="
                      w-full
                      border
                      p-3
                      rounded-xl
                      mb-3
                    "
                  />

                  <div className="
                    grid
                    grid-cols-3
                    gap-3
                  ">

                    <input
                      type="text"
                      placeholder="ขนาด"
                      value={item.size}
                      onChange={(e) => {

                        const newItems =
                          [...items];

                        newItems[index].size =
                          e.target.value;

                        setItems(newItems);

                      }}
                      className="
                        border
                        p-3
                        rounded-xl
                      "
                    />

                    <input
                      type="number"
                      placeholder="จำนวน"
                      value={item.qty}
                      onChange={(e) => {

                        const newItems =
                          [...items];

                        newItems[index].qty =
                          e.target.value;

                        setItems(newItems);

                      }}
                      className="
                        border
                        p-3
                        rounded-xl
                      "
                    />

                    <input
                      type="number"
                      placeholder="ราคา"
                      value={item.price}
                      onChange={(e) => {

                        const newItems =
                          [...items];

                        newItems[index].price =
                          e.target.value;

                        setItems(newItems);

                      }}
                      className="
                        border
                        p-3
                        rounded-xl
                      "
                    />

                  </div>

                </div>

              ))}

            </div>

            {/* BUTTONS */}

            <div className="
              flex
              gap-3
              mt-6
            ">

              <button
                onClick={() =>
                  setEditOpen(false)
                }
                className="
                  flex-1
                  border
                  p-4
                  rounded-xl
                "
              >
                ปิด
              </button>

              <button
                onClick={updateData}
                className="
                  flex-1
                  bg-green-500
                  text-white
                  p-4
                  rounded-xl
                "
              >
                บันทึก
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}