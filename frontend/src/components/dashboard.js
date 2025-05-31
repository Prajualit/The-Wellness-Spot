export default function Dashboard() {


    return(
        <div className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden" style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaeef1] px-10 py-3">
          <div className="flex items-center gap-4 text-[#101518]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em]">FitTrack</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#101518] text-sm font-medium leading-normal" href="#">Overview</a>
              <a className="text-[#101518] text-sm font-medium leading-normal" href="#">Workouts</a>
              <a className="text-[#101518] text-sm font-medium leading-normal" href="#">Nutrition</a>
              <a className="text-[#101518] text-sm font-medium leading-normal" href="#">Community</a>
            </div>
            <button
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#eaeef1] text-[#101518] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <div className="text-[#101518]" data-icon="Bell" data-size="20px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"
                  ></path>
                </svg>
              </div>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCacMB_RFLrqIUr3XbAg_lEC7-ZzWnpA5BwQsQnvRaA166WkWGHOSf6yCROsZHxjCnVVsWl1ZqGcgjEyztyqnMLFE1YRQA6H6OWl7PkqZVFKlHn_g0B0GjMd0v0_IoMa7f8vrHJH5-wd4jsAk9tWdGtX-LFMwNb_d9k3TA1KuN2kQ1gD57DMA-WpU1qC9RMA__n6rSoIPHKyjfzhMfXj1r1MuJBstZRPsFChy3yvl1I8LDBX5P-7rtOlj59RBvyZ7nIYusUM-QDjTE")'
              }}
            ></div>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4"><p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight min-w-72">Health Records</p></div>
            <div className="flex p-4 @container">
              <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                <div className="flex gap-4">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"        style={{backgroundImage:'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAJiUPRGZ9-zkSv-X0crsENy3tqJ7_pP5bW-QInTviAFc-yUhsxRW2wD0pIhuIoQ8kCdhB6ZNmiWulNlf3OomtwqvpeBeVGytWPG_NKADvoU_w37Wiepwu-L5rPWaRMgrCXVB7AkuthPqRlZk50roHEtP831fU8M1M-xPo7ONogOARtvc2cuE8jKZ-2rVG8JRAG8C-haECpZ9L3CfFPusnmdOTCQ7wzxWBgEA5sOyNGMIfWOK2rD2Mk5HHv4-6X8F0JZF0u0Qnj1LY")'}}>
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em]">Olivia Bennett</p>
                    <p className="text-[#5c778a] text-base font-normal leading-normal">Age: 30, Height: 5&apos;6&apos;&apos;</p>
                </div>
                </div>
              </div>
            </div>
            <div className="flex px-4 py-3 justify-start">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#eaeef1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Change Profile Photo</span>
              </button>
            </div>
            <div className="px-4 py-3 @container">
              <div className="flex overflow-hidden rounded-xl border border-[#d4dde2] bg-gray-50">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-120 px-4 py-3 text-left text-[#101518] w-[400px] text-sm font-medium leading-normal">Date</th>
                      <th className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-240 px-4 py-3 text-left text-[#101518] w-[400px] text-sm font-medium leading-normal">
                        Blood Sugar
                      </th>
                      <th className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-360 px-4 py-3 text-left text-[#101518] w-[400px] text-sm font-medium leading-normal">
                        Blood Pressure
                      </th>
                      <th className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-480 px-4 py-3 text-left text-[#101518] w-[400px] text-sm font-medium leading-normal">BMI</th>
                      <th className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-600 px-4 py-3 text-left text-[#101518] w-[400px] text-sm font-medium leading-normal">Weight</th>
                      <th className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-720 px-4 py-3 text-left text-[#101518] w-60 text-[#5c778a] text-sm font-medium leading-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-t-[#d4dde2]">
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-120 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        2024-07-20
                      </td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">95 mg/dL</td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-360 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        120/80 mmHg
                      </td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-480 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">22.5</td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-600 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">135 lbs</td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-720 h-[72px] px-4 py-2 w-60 text-[#5c778a] text-sm font-bold leading-normal tracking-[0.015em]">
                        Edit | Delete
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#d4dde2]">
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-120 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        2024-07-13
                      </td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">98 mg/dL</td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-360 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        122/82 mmHg
                      </td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-480 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">22.7</td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-600 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">136 lbs</td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-720 h-[72px] px-4 py-2 w-60 text-[#5c778a] text-sm font-bold leading-normal tracking-[0.015em]">
                        Edit | Delete
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#d4dde2]">
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-120 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        2024-07-06
                      </td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">97 mg/dL</td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-360 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        121/81 mmHg
                      </td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-480 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">22.6</td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-600 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        135.5 lbs
                      </td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-720 h-[72px] px-4 py-2 w-60 text-[#5c778a] text-sm font-bold leading-normal tracking-[0.015em]">
                        Edit | Delete
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#d4dde2]">
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-120 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        2024-06-29
                      </td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        100 mg/dL
                      </td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-360 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        124/84 mmHg
                      </td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-480 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">22.8</td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-600 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">137 lbs</td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-720 h-[72px] px-4 py-2 w-60 text-[#5c778a] text-sm font-bold leading-normal tracking-[0.015em]">
                        Edit | Delete
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#d4dde2]">
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-120 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        2024-06-22
                      </td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">96 mg/dL</td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-360 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        120/80 mmHg
                      </td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-480 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">22.5</td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-600 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">135 lbs</td>
                      <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-720 h-[72px] px-4 py-2 w-60 text-[#5c778a] text-sm font-bold leading-normal tracking-[0.015em]">
                        Edit | Delete
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <style jsx>{`
  @container (max-width:120px) {
    .table-952c22f1-0138-435f-b64e-7ec1d8771011-column-120 { display: none; }
  }
  @container(max-width:240px){.table-952c22f1-0138-435f-b64e-7ec1d8771011-column-240{display: none;}}
  @container(max-width:360px){.table-952c22f1-0138-435f-b64e-7ec1d8771011-column-360{display: none;}}
  @container(max-width:480px){.table-952c22f1-0138-435f-b64e-7ec1d8771011-column-480{display: none;}}
  @container(max-width:600px){.table-952c22f1-0138-435f-b64e-7ec1d8771011-column-600{display: none;}}
  @container(max-width:720px){.table-952c22f1-0138-435f-b64e-7ec1d8771011-column-720{display: none;}}
`}</style>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}