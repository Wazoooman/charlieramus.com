import { ArrowUpRight } from "lucide-react";

type GearItem = {
  name: string;
  note: string;
  href: string;
};

const gear: Record<string, GearItem[]> = {
  bodies: [
    // CUSTOMIZE: camera body name, short note (e.g. "Primary body"), and manufacturer/retailer URL or ""
    { name: "Canon EOS R5", note: "Primary body", href: "https://www.bhphotovideo.com/c/product/1547009-REG/canon_4147c002_eos_r5_mirrorless_camera.html" },
    // CUSTOMIZE: add more bodies here
    { name: "DJI Air 2s Combo", note: "Primary drone", href: "https://www.bhphotovideo.com/c/product/1632435-REG/dji_cp_ma_00000354_01_air_2s_drone.html" },
  ],
  lenses: [
    // CUSTOMIZE: lens name, short note (e.g. "Portraits"), and manufacturer/retailer URL or ""
    { name: "Canon RF 24-105mm f/4", note: "", href: "https://www.bhphotovideo.com/c/product/1433712-REG/canon_rf_24_105mm_f_4l_is.html" },
    // CUSTOMIZE: add more lenses here
    { name: "Sigma 150-600mm f/5.6-6.3 ", note: "", href: "https://www.bhphotovideo.com/c/product/1082154-REG/sigma_150_600mm_f_5_6_3_dg_os.html" },
  ],
  bags: [
    // CUSTOMIZE: bag name, short note (e.g. "Everyday carry"), and manufacturer/retailer URL or ""
    { name: "Kiboko V1 30L+ ", note: "Long travel/High capacity", href: "https://www.ebay.com/sch/i.html?_nkw=Gura+Gear+Kiboko+30L&_sacat=0&_from=R40&_trksid=m570.l1313&_odkw=Gura+GearKiboko+30L&_osacat=0" },
    // CUSTOMIZE: add more bags here
    { name: "Thule Aspect V2", note: "Everyday carry", href: "https://www.ebay.com/sch/i.html?_nkw=Thule+aspect+&_sacat=0&_from=R40&_trksid=m570.l1313&_odkw=Thule+aspect+v2&_osacat=0" },
  ],
  accessories: [
    // CUSTOMIZE: accessory name, short note, and manufacturer/retailer URL or ""
    { name: "Tripod", note: "", href: "https://www.bhphotovideo.com/c/product/1709952-REG/k_f_concept_kf09_094v1_carbon_fiber_tripod.html/?ap=y&ap=y&smp=y&smp=y&store=420&smpm=ba_f2_lar&lsft=BI%3A6879&gad_source=4&gad_campaignid=13535675462&gbraid=0AAAAAD7yMh2-BsPth8MvIv6o9FC55Hv69&gclid=Cj0KCQjw_IXQBhCkARIsADqELbKylinNSFx4675US7M7rDL26T8IHpmMekAByTovRlDgJJ5HY3Xi2N8aAsXSEALw_wcB" },
    // CUSTOMIZE: add more accessories here
    { name: "Mic", note: "", href: "https://www.bhphotovideo.com/c/product/1654686-REG/deity_microphones_v_mic_d4_mini_ultracompact.html?ap=y&smp=Y&srsltid=AfmBOooYrz24PMmp4E67BlJUmh25rS6HgFXILEJefhMlyB-MQt4OwqW3aPA" },
  ],
};

const sections: { key: keyof typeof gear; label: string }[] = [
  { key: "bodies", label: "Camera Bodies" },
  { key: "lenses", label: "Lenses" },
  { key: "bags", label: "Bags" },
  { key: "accessories", label: "Accessories" },
];

export default function GearList() {
  return (
    <div className="flex flex-col gap-10">
      {sections.map(({ key, label }) => (
        <div key={key}>
          <p className="label mb-2">
            {label}
          </p>
          <div className="h-px bg-rule mb-4" />
          <div className="flex flex-col gap-3">
            {gear[key].map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-fg">{item.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  {item.note && (
                    <span className="text-xs text-muted">{item.note}</span>
                  )}
                  {item.href && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${item.name}`}
                      className="text-muted hover:text-cobalt transition-colors duration-150"
                    >
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
