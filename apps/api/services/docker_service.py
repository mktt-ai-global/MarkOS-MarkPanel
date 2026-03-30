import docker
from typing import List, Dict, Any, Optional

class DockerService:
    def __init__(self):
        try:
            self.client = docker.from_env()
        except Exception as e:
            print(f"Error connecting to Docker: {e}")
            self.client = None

    def list_containers(self, all: bool = True) -> List[Dict[str, Any]]:
        if not self.client:
            return []
        
        containers = self.client.containers.list(all=all)
        return [
            {
                "id": container.short_id,
                "name": container.name,
                "status": container.status,
                "image": container.image.tags[0] if container.image.tags else "unknown",
                "ports": container.ports,
                "created": container.attrs.get('Created')
            }
            for container in containers
        ]

    def get_container_status(self, container_id: str) -> Optional[Dict[str, Any]]:
        if not self.client:
            return None
        
        try:
            container = self.client.containers.get(container_id)
            return {
                "id": container.short_id,
                "name": container.name,
                "status": container.status,
                "state": container.attrs.get('State', {}),
                "image": container.image.tags[0] if container.image.tags else "unknown"
            }
        except docker.errors.NotFound:
            return None

    def container_action(self, container_id: str, action: str) -> bool:
        if not self.client:
            return False
        
        try:
            container = self.client.containers.get(container_id)
            if action == "start":
                container.start()
            elif action == "stop":
                container.stop()
            elif action == "restart":
                container.restart()
            elif action == "remove":
                container.remove(force=True)
            else:
                return False
            return True
        except Exception as e:
            print(f"Docker action {action} failed: {e}")
            return False

    def get_container_logs(self, container_id: str, tail: int = 100):
        if not self.client:
            return
        
        try:
            container = self.client.containers.get(container_id)
            return container.logs(stream=True, follow=True, tail=tail)
        except Exception as e:
            print(f"Error fetching logs: {e}")
            return None

docker_service = DockerService()
