import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaMobile, FaPhone } from "react-icons/fa";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  console.log(landlord);
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 rounded-lg hover:opacity-95"
          >
            <span className="flex items-center gap-2 justify-center">
              <FaEnvelope />
              <span className="font-semibold">Send Mail to</span>
              <a href={`callto:${landlord.email}`}>{landlord.email}</a>
            </span>
          </Link>
          {landlord.phone && (
            <div className="bg-green-800 text-white p-3 rounded-lg">
              <span className="flex items-center gap-2 justify-center">
                <FaPhone />
                <span className="font-semibold">Call At</span>
                <a href={`callto:${landlord.phone}`}>{landlord.phone}</a>
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
