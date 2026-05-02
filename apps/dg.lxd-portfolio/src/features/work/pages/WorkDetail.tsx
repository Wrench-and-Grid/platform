import { useParams } from "react-router-dom";
import { workItems } from "../data/works";

export default function WorkDetail() {
  const { slug } = useParams();

  // Find the matching project
  const project = workItems.find((item) => item.slug === slug);

  // Safety check
  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Optional header */}
      <div style={{ padding: "20px" }}>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
      </div>

      {/* PDF Viewer */}
      <div style={{ flex: 1 }}>
        <iframe
          src={project.pdf}
          width="100%"
          height="100%"
          title={project.title}
        />
      </div>

    </div>
  );
}