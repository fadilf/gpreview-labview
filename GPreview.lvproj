<?xml version='1.0' encoding='UTF-8'?>
<Project Type="Project" LVVersion="19008000">
	<Property Name="NI.LV.All.SaveVersion" Type="Str">19.0</Property>
	<Property Name="NI.LV.All.SourceOnly" Type="Bool">true</Property>
	<Item Name="My Computer" Type="My Computer">
		<Property Name="server.app.propertiesEnabled" Type="Bool">true</Property>
		<Property Name="server.control.propertiesEnabled" Type="Bool">true</Property>
		<Property Name="server.tcp.enabled" Type="Bool">false</Property>
		<Property Name="server.tcp.port" Type="Int">0</Property>
		<Property Name="server.tcp.serviceName" Type="Str">My Computer/VI Server</Property>
		<Property Name="server.tcp.serviceName.default" Type="Str">My Computer/VI Server</Property>
		<Property Name="server.vi.callsEnabled" Type="Bool">true</Property>
		<Property Name="server.vi.propertiesEnabled" Type="Bool">true</Property>
		<Property Name="specify.custom.address" Type="Bool">false</Property>
		<Item Name="Test Cases" Type="Folder" URL="../Test Cases">
			<Property Name="NI.DISK" Type="Bool">true</Property>
		</Item>
		<Item Name="CLI.vi" Type="VI" URL="../CLI.vi"/>
		<Item Name="Directory.vi" Type="VI" URL="../Directory.vi"/>
		<Item Name="Image to PNG Data URI.vi" Type="VI" URL="../Image to PNG Data URI.vi"/>
		<Item Name="VI Data Extractor.vi" Type="VI" URL="../VI Data Extractor.vi"/>
		<Item Name="Dependencies" Type="Dependencies"/>
		<Item Name="Build Specifications" Type="Build"/>
	</Item>
</Project>
