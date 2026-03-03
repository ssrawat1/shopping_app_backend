export default function rateLimiter({ window, limit, message }) {
  const limiterStore = {}
  return (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();
    if (!limiterStore[ip]) {
      limiterStore[ip] = {
        totalRequest: 1,
        requestTime: currentTime
      }
      return next()
    }
    const diff = currentTime - limiterStore[ip].requestTime
    console.log({ diff })
    if (diff > window) {
      limiterStore[ip].totalRequest = 1,
        limiterStore[ip].requestTime = currentTime
    } else {
      if (limiterStore[ip].totalRequest >= limit) {
        return res.status(429).json({ error: message || "Too many request, please try later" })
      }
      limiterStore[ip].totalRequest++
      console.log(limiterStore)
    }
    return next()
  }
}