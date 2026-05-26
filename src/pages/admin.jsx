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

  const [address, setAddress] =
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

        ||

        item.address
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
      `https://script.google.com/macros/s/AKfycby2e5opqSOVWTBE2yu-mAFsTT3JN1maBZyWAQjda9yVHSn_-o5CrJO2tIHyYeWGlggL/exec?callback=loadData&t=${Date.now()}`;

    document.body.appendChild(script);
  };

  // =========================
  // UPDATE
  // =========================

  const updateData = async () => {

    const item = items[0];

    await fetch(
      "https://script.google.com/macros/s/AKfycby2e5opqSOVWTBE2yu-mAFsTT3JN1maBZyWAQjda9yVHSn_-o5CrJO2tIHyYeWGlggL/exec",
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

          address,

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
      "https://script.google.com/macros/s/AKfycby2e5opqSOVWTBE2yu-mAFsTT3JN1maBZyWAQjda9yVHSn_-o5CrJO2tIHyYeWGlggL/exec",
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
  // SAVE IMAGE
  // =========================

  const saveInvoiceImage = (item) => {

    if (
      item.payment !== "โอน" &&
      item.payment !== "เงินสด"
    ) {

      alert("รายการนี้ไม่ใช่ โอน หรือ เงินสด");

      return;
    }

    const total =
      Number(item.qty || 0) *
      Number(item.price || 0);

    const html = `
      <html>
      <head>

        <title>Invoice</title>

        <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>

        <style>

          body{
            margin:0;
            background:#e5e5e5;
            font-family:sans-serif;
          }

          #invoice{
            width:1400px;
            min-height:2000px;
            background:white;
            margin:auto;
            padding:40px;
            box-sizing:border-box;
          }

          .top{
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
          }

          .logo{
            width:180px;
          }

          .title{
            font-size:72px;
            font-weight:900;
            text-align:right;
            line-height:1.1;
          }

          .date{
            font-size:32px;
            margin-top:20px;
            text-align:right;
          }

          .company{
            font-size:28px;
            line-height:1.8;
          }

          .customer{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:40px;
            margin-top:120px;
            font-size:32px;
          }

          .line{
            border-bottom:2px solid #ccc;
            padding-bottom:10px;
          }

          .tax{
            margin-top:30px;
            font-size:32px;
            border-bottom:2px solid #ccc;
            padding-bottom:10px;
            white-space:pre-wrap;
          }

          .table{
            margin-top:60px;
            border:3px solid black;
            border-radius:40px;
            overflow:hidden;
          }

          .thead{
            display:grid;
            grid-template-columns:5fr 2fr 2fr 2fr 1fr;
            background:#2b2b2b;
            color:white;
            font-size:28px;
            font-weight:bold;
          }

          .thead div{
            padding:25px;
            border-right:1px solid white;
          }

          .row{
            display:grid;
            grid-template-columns:5fr 2fr 2fr 2fr 1fr;
            min-height:100px;
            font-size:28px;
            border-top:2px solid black;
          }

          .row div{
            padding:25px;
            border-right:2px solid black;
          }

          .footer{
            display:flex;
            justify-content:space-between;
            margin-top:80px;
            gap:40px;
          }

          .note{
            width:55%;
          }

          .right{
            width:45%;
          }

          .total{
            border:3px solid black;
            border-radius:999px;
            padding:20px 40px;
            font-size:40px;
            font-weight:bold;
            display:flex;
            justify-content:space-between;
          }

          .qr{
            margin-top:40px;
            text-align:center;
          }

          .qr img{
            width:420px;
          }

        </style>

      </head>

      <body>

        <div id="invoice">

          <div class="top">

            <img
              class="logo"
              src="/img/5.png"
            />

            <div class="company">

              ดีอาร์ อิงค์เจ็ท ปริ้นซ์
              <br/>

              96 ตลาดสุขใจ ตำบลคลองหนึ่ง
              <br/>

              อำเภอคลองหลวง จังหวัดปทุมธานี
              <br/>

              โทร. 063 846 2546 และ 065 569 9961
              <br/>

              email: dr.inkjet.print@gmail.com

            </div>

            <div>

              <div class="title">
                ใบเสร็จรับเงิน
              </div>

              <div class="date">
                วันที่ ${new Date(item.date).toLocaleDateString("th-TH")}
              </div>

            </div>

          </div>

          <div class="customer">

            <div class="line">
              ชื่อลูกค้า: ${item.customer || ""}
            </div>

            <div class="line">
              เบอร์ติดต่อ: ${item.phone || ""}
            </div>

          </div>

          <div class="tax">
            เลขประจำตัวผู้เสียภาษี:
            ${item.tax || ""}
          </div>

          <div class="tax">
            ที่อยู่:
            ${item.address || ""}
          </div>

          <div class="table">

            <div class="thead">

              <div>รายละเอียดสินค้า</div>

              <div>ขนาด</div>

              <div>จำนวน</div>

              <div>ราคา/หน่วย</div>

              <div>รวม</div>

            </div>

            <div class="row">

              <div>${item.name || ""}</div>

              <div>${item.size || ""}</div>

              <div>${item.qty || ""}</div>

              <div>${item.price || ""}</div>

              <div>${total}</div>

            </div>

          </div>

          <div class="footer">

            <div class="note">

              <div style="font-size:42px;font-weight:bold;">
                *หมายเหตุ
              </div>

              <div style="font-size:30px;margin-top:20px;color:red;">
                ${item.note || ""}
              </div>

            </div>

            <div class="right">

              <div class="total">

                <span>
                  รวมทั้งสิ้น:
                </span>

                <span>
                  ${total}
                </span>

              </div>

              <div class="qr">

                <img src="/img/line.png"/>

              </div>

            </div>

          </div>

        </div>

        <script>

          window.onload = async () => {

            const canvas =
              await html2canvas(
                document.getElementById("invoice"),
                {
                  scale:2,
                  useCORS:true,
                  backgroundColor:"#ffffff"
                }
              );

            const image =
              canvas.toDataURL("image/png");

            const link =
              document.createElement("a");

            link.href = image;

            link.download =
              "invoice-${item.row}.png";

            link.click();
          };

        </script>

      </body>
      </html>
    `;

    const win =
      window.open("", "_blank");

    win.document.write(html);

    win.document.close();
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

  return (

    <div className="min-h-screen bg-gray-100 p-5">

      <div className="bg-white rounded-3xl shadow-xl p-6">

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

        <div className="overflow-auto rounded-2xl border">

          <table className="w-full text-sm min-w-[1600px]">

            <thead className="bg-black text-white">

              <tr>

                <th className="p-3 text-left">วันที่</th>
                <th className="p-3 text-left">รายการ</th>
                <th className="p-3 text-left">ขนาด</th>
                <th className="p-3 text-center">จำนวน</th>
                <th className="p-3 text-center">ราคา</th>
                <th className="p-3 text-center">รวม</th>
                <th className="p-3 text-left">การชำระเงิน</th>
                <th className="p-3 text-left">ลูกค้า</th>
                <th className="p-3 text-left">เบอร์โทร</th>
                <th className="p-3 text-left">เลขผู้เสียภาษี</th>
                <th className="p-3 text-left">หมายเหตุ</th>
                <th className="p-3 text-left">ที่อยู่</th>
                <th className="p-3 text-left">จัดการ</th>

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
                              .toLocaleDateString("th-TH")
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

                    <td className="p-3 whitespace-pre-wrap">
                      {item.note}
                    </td>

                    <td className="p-3 whitespace-pre-wrap max-w-[300px]">
                      {item.address}
                    </td>

                    <td className="p-3 flex gap-2 flex-wrap">

                      <button

                        onClick={() =>
                          saveInvoiceImage(item)
                        }

                        className="
                          bg-green-500
                          hover:bg-green-600
                          text-white
                          px-4
                          py-2
                          rounded-xl
                        "

                      >
                        Save PNG
                      </button>

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

                          setAddress(
                            item.address || ""
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
                    colSpan="13"
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
                placeholder="ที่อยู่"
                value={address}
                onChange={(e) =>
                  setAddress(
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