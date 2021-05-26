import { parseCookies } from "@/helpers/index";
import moment from "moment";
import { useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Image from "next/image";
import { FaImage } from "react-icons/fa";
import { API_URL } from "@/config/index";
import styles from "@/styles/Form.module.css";
import Layout from "@/components/Layout";
import Modal from "@/components/Modal";
import ImageUpload from "@/components/ImageUpload";
export default function EditEventPage({ evt, token }) {
  const [values, setValues] = useState({
    name: evt.name,
    Performers: evt.Performers,
    venue: evt.venue,
    address: evt.address,
    time: evt.time,
    date: evt.date,
    description: evt.description,
  });
  const [imagePreview, setImagePreview] = useState(
    evt.image ? evt.image.formats.thumbnail.url : null
  );
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation
    const hasEmptyFields = Object.values(values).some((elem) => elem === "");

    if (hasEmptyFields) {
      toast.error("Please fill in all fields");
    }
    const res = await fetch(`${API_URL}/events/${evt.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      if (res.statsCode === 403 || res.statusCode === 401) {
        toast.error("Unauthorized!");
        return;
      }
      toast.error("Something went wrong!");
    } else {
      const evt = await res.json();
      router.push(`/events/${evt.slug}`);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const imageUploaded = async (e) => {
    const res = await fetch(`${API_URL}/events/${evt.id}`);
    const data = await res.json();
    setImagePreview(data.image.formats.thumbnail.url);
    setShowModal(false);
  };
  return (
    <Layout title="Edit Events">
      <Link href="/events">Go Back</Link>
      <h1>Edit Event </h1>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="name">Event Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="name">Performers</label>
            <input
              type="text"
              id="performers"
              name="Performers"
              value={values.Performers}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="name">Venue</label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={values.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="name">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={values.address}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="name">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={moment(values.date).format("yyyy-MM-DD")}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="name">Time</label>
            <input
              type="text"
              id="time"
              name="time"
              value={values.time}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            type="text"
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <input type="submit" value="Update Event" className="btn" />
      </form>
      <h2>Event Image</h2>
      {imagePreview ? (
        <Image src={imagePreview} height={100} width={170} />
      ) : (
        <div>
          <p>No image uploaded</p>
        </div>
      )}
      <div>
        <button className="btn-secondary" onClick={(e) => setShowModal(true)}>
          <FaImage /> Set Image
        </button>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload
          evtId={evt.id}
          token={token}
          imageUploaded={imageUploaded}
        />
      </Modal>
    </Layout>
  );
}

export async function getServerSideProps({ params: { id }, req }) {
  const { token } = parseCookies(req);
  const res = await fetch(`${API_URL}/events/${id}`);
  const evt = await res.json();
  return {
    props: {
      evt,
      token,
    },
  };
}
