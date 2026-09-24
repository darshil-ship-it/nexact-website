import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/components/ui/reveal";
import { ServiceSection } from "@/components/sections/service-section";
import { getVisibleServices, servicesIntro } from "@/content/services";
import "./services.css";

export const metadata = pageMetadata("/services", servicesIntro.title, servicesIntro.description);

export default function ServicesPage() {
  const visibleServices = getVisibleServices();

  return (
    <div className="services-page">
      <header className="services-hero">
        <div className="container services-hero__layout">
          <Reveal className="services-hero__main">
            <p className="services-hero__eyebrow">{servicesIntro.eyebrow}</p>
            <h1>{servicesIntro.title}</h1>
          </Reveal>
          <Reveal className="services-hero__aside" delay={0.12}>
            <p className="services-hero__description">{servicesIntro.description}</p>
            <p className="services-hero__note">{servicesIntro.note}</p>
          </Reveal>
        </div>
      </header>

      <div className="services-list">
        {visibleServices.map((service, index) => (
          <ServiceSection key={service.id} service={service} reverse={index % 2 === 1} />
        ))}
      </div>
    </div>
  );
}
