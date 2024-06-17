import { GlobalStyles } from "@mui/material";

const ScrollbarStyle = () => (
  <GlobalStyles
    styles={`
      ::-webkit-scrollbar {
        width: 10px; /* Scrollbar width */
      }

      ::-webkit-scrollbar-track {
        background: #f1f1f1; /* Scrollbar track color */
      }

      ::-webkit-scrollbar-thumb {
        background: #61A5D2; /* Scrollbar thumb color */
        border-radius: 10px; /* Rounded corners on the scrollbar thumb */
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #555; /* Scrollbar thumb hover color */
      }
    `}
  />
);

export default ScrollbarStyle;
