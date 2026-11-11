import Image from "next/image";
import type { Service } from "@/data/services";

export function ServiceImage({
  src,
  alt = "",
  mobile = false,
}: {
  src: string;
  alt?: string;
  mobile?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={mobile ? "(max-width: 700px) 100vw, 460px" : "460px"}
      className="service-preview-image"
    />
  );
}

function Demo({ service, mobile }: { service: Service; mobile: boolean }) {
  const phones = service.id === "mobile-apps" && mobile;
  return (
    <div className={`service-demo${phones ? " service-demo-phones" : ""}`}>
      {(phones ? [0, 1, 2] : [0]).map((slot) => (
        <div className="service-screen-slot" key={slot}>
          {service.screens.map((src, index) => (
            <div
              className="service-screen"
              style={{
                zIndex: index === slot % service.screens.length ? 2 : 1,
              }}
              key={src}
            >
              <ServiceImage src={src} mobile={mobile} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ServicePreview({
  service,
  mobile = false,
}: {
  service: Service;
  mobile?: boolean;
}) {
  if (mobile)
    return (
      <div className="service-slide-strip">
        <div className="service-preview-slide">
          <ServiceImage src={service.stage} mobile />
          <Demo service={service} mobile />
        </div>
        {service.slides.map((image, index) => (
          <div className="service-preview-slide" key={`${image}-${index}`}>
            <ServiceImage src={image} mobile />
          </div>
        ))}
      </div>
    );
  return (
    <>
      <div className="service-preview-cover">
        <ServiceImage src={service.cover} />
      </div>
      <Demo service={service} mobile={false} />
    </>
  );
}
