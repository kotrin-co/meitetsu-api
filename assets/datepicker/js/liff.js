document.getElementById("dp_ok").addEventListener("click", () => {
  const liffId = "1656766461-gKzBwL6O";
  const yy = document.getElementById("birth-year").value;
  const mm = document.getElementById("birth-month").value;
  const dd = document.getElementById("birth-date").value;
  if (liff.isInClient()) {
    liff.init({ liffId })
      .then(async () => {
        await liff.sendMessages([
          {
            type: "text",
            text: `${yy}年${mm}月${dd}日`
          }
        ]);
        liff.closeWindow();
      });
  }
});