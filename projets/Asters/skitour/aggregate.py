#!/usr/bin/env python

import json
import gpxpy
import geojson
from geojson import Feature, FeatureCollection, LineString, MultiLineString
from pathlib import Path
from argparse import ArgumentParser
from types import SimpleNamespace
from datetime import date


def main():
    features = []

    for path in [Path("data/topos/m21"), Path("data/topos/m25")]:
        topos = json.load(path.open(), object_hook=lambda d: SimpleNamespace(**d))
        for topo in topos:
            p = Path(f"data/topo/{topo.id}")
            if p.exists():
                try:
                    topo = json.load(
                        p.open(), object_hook=lambda d: SimpleNamespace(**d)
                    )
                except Exception as e:
                    pass
            properties = {
                "id": f"topo{topo.id}",
                "origine": "skitour",
                "activite": "skitour",
                "type": "topo",
                "date": None,
            }
            if hasattr(topo, "itineraire"):
                properties["description"]: f"{topo.nom}\n\n{topo.itineraire}"
            else:
                properties["description"] = topo.nom
            p = Path(f"data/sorties/t={topo.id}")
            if p.exists():
                sorties = json.load(
                    p.open(),
                    object_hook=lambda d: SimpleNamespace(**d),
                )
                properties["nb_personnes"] = len(sorties) * 2
            geom = None
            p = Path("data") / "topo" / f"{topo.id}.gpx"
            if p.exists():
                try:
                    gpx = gpxpy.parse(p.open())
                except Exception as e:
                    break
                track = gpx.tracks[0]
                if len(track.segments) == 1:
                    geom = LineString(
                        [
                            (point.longitude, point.latitude)
                            for point in track.segments[0].points
                        ]
                    )
                else:
                    geom = MultiLineString(
                        [
                            [
                                (point.longitude, point.latitude)
                                for point in segment.points
                            ]
                            for segment in track.segments
                        ]
                    )
            feature = Feature(geometry=geom, properties=properties)
            features.append(feature)

    for path in [
        Path("data/sorties/a=2024-l=1000-m=25"),
        Path("data/sorties/a=2024-l=1000-m=21"),
    ]:
        sorties = json.load(
            path.open(),
            object_hook=lambda d: SimpleNamespace(**d),
        )
        for sortie in sorties:
            properties = {
                "id": f"sortie{sortie.id}",
                "origine": "skitour",
                "activite": "skitour",
                "nb_personnes": 2,
                "type": "sortie",
                "description": f"{sortie.titre}\n\n{sortie.recit}",
                "date": str(date.fromtimestamp(int(sortie.date))),
            }
            if hasattr(sortie, "gpx"):
                p = Path("data") / sortie.gpx[1:]
                gpx = gpxpy.parse(p.open())
                track = gpx.tracks[0]
                if len(track.segments) == 1:
                    geom = LineString(
                        [
                            (point.longitude, point.latitude)
                            for point in track.segments[0].points
                        ]
                    )
                else:
                    geom = MultiLineString(
                        [
                            [
                                (point.longitude, point.latitude)
                                for point in segment.points
                            ]
                            for segment in track.segments
                        ]
                    )
            else:
                geom = None
            feature = Feature(geometry=geom, properties=properties)
            features.append(feature)

    collection = FeatureCollection(features=features)

    with Path("skitour.geojson").open("w") as fp:
        geojson.dump(collection, fp)


if __name__ == "__main__":
    parser = ArgumentParser()
    args = parser.parse_args()
    main()
