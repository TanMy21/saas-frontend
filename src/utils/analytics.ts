import posthog from "posthog-js";

posthog.init(`${import.meta.env.VITE_POSTHOG_KEY}`, {
  api_host: "https://app.posthog.com",
  autocapture: true,
  mask_all_text: false,
  session_recording: {
    maskAllInputs: false,
    maskInputOptions: {
      password: true,
      // color: false,
      // date: false,
      // 'datetime-local': false,
      // email: false,
      // month: false,
      // number: false,
      // range: false,
      // search: false,
      // tel: false,
      text: true,
      // time: false,
      // url: false,
      // week: false,
      // textarea: false,
      // select: false,
    },
  },
});

export default posthog;
